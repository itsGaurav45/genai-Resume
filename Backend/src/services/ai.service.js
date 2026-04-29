const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// 🔄 RETRY HELPER
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (
        error.message?.includes("429") ||
        error.message?.includes("RESOURCE_EXHAUSTED")
      ) {
        const delay = Math.pow(2, attempt) * 1000;
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          throw new Error("Max retries exceeded.");
        }
      } else {
        throw error;
      }
    }
  }
}

// ================= PDF GENERATOR =================

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();
  return pdfBuffer;
}

// 🔥 SAFE JSON PARSER (MAIN FIX)
function extractJson(response) {
  const rawText =
    response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  if (!rawText) {
    throw new Error("Empty response from AI");
  }

  try {
    return JSON.parse(rawText);
  } catch (err) {
    console.error("❌ Invalid JSON from AI:\n", rawText);
    throw new Error("AI returned invalid JSON");
  }
}

// ================= INTERVIEW REPORT =================

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are an expert interview coach.

Return ONLY valid JSON. No markdown. No explanation.

{
  "score": number,
  "matchPercentage": number,
  "technicalQuestions": [
    { "question": "string", "intention": "string", "answer": "string" }
  ],
  "behavioralQuestions": [
    { "question": "string", "intention": "string", "answer": "string" }
  ],
  "roadmap": [
    { "day": number, "focus": "string", "tasks": ["string"] }
  ],
  "strengths": ["string"],
  "weaknesses": ["string"],
  "recommendations": ["string"]
}

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`;

  try {
    const response = await retryWithBackoff(async () =>
      await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      })
    );

    return extractJson(response);
  } catch (error) {
    console.error("AI Interview Error:", error);
    throw error;
  }
}

// ================= RESUME PDF =================

async function generateResumePDF({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are a professional resume designer.

Return ONLY valid JSON.

{
  "html": "<complete HTML here>"
}

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`;

  const response = await retryWithBackoff(async () =>
    await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    })
  );

  const jsonContent = extractJson(response);

  // 🔥 SAME DESIGN (UNCHANGED)
  const finalHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body {
  font-family: Arial, sans-serif;
  color: #333;
  line-height: 1.5;
}

.container {
  max-width: 800px;
  margin: auto;
}

.name {
  font-size: 28px;
  font-weight: bold;
}

.contact {
  font-size: 12px;
  color: #555;
  margin-top: 5px;
}

.section {
  margin-top: 20px;
}

.section-title {
  font-weight: bold;
  text-transform: uppercase;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
  padding-bottom: 4px;
}

.skills {
  display: flex;
  justify-content: space-between;
}

.skills div {
  width: 48%;
}

ul {
  margin: 5px 0;
  padding-left: 18px;
}
</style>
</head>
<body>
<div class="container">
${jsonContent.html}
</div>
</body>
</html>
`;

  const pdfBuffer = await generatePdfFromHtml(finalHtml);
  return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePDF };