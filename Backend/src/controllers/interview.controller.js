const pdfParse = require("pdf-parse/lib/pdf-parse.js")
const  {generateInterviewReport,generateResumePDF}   = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterviewReportController(req, res) {

    try {
        const { selfDescription, jobDescription } = req.body

        console.log("Request body:", { selfDescription: selfDescription?.substring(0, 50), jobDescription: jobDescription?.substring(0, 50) })
        console.log("File info:", req.file ? { fieldname: req.file.fieldname, size: req.file.size, mimetype: req.file.mimetype } : "No file")

        // Validate required fields
        if (!selfDescription && !req.file) {
            return res.status(400).json({
                message: "Either a resume file or self-description is required."
            })
        }

        if (!jobDescription) {
            return res.status(400).json({
                message: "Job description is required."
            })
        }

        let resumeContent = selfDescription

        // If resume file is provided, parse it
        if (req.file) {
            console.log("Parsing PDF file:", req.file.originalname)
            try {
                const parsedPdf = await pdfParse(req.file.buffer);
                resumeContent = parsedPdf.text || parsedPdf;
                console.log("Parsed PDF successfully, length:", resumeContent?.length)
            } catch (parseError) {
                console.error("PDF parsing error:", parseError.message)
                resumeContent = `[PDF File: ${req.file.originalname}]`
                console.warn("Using fallback since PDF parsing failed")
            }
        }

        //  DEBUG LINE
        console.log("RESUME TEXT:\n", resumeContent);

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            selfDescription,
            jobDescription
        })

        // Extract job title from job description (look for "Position:" line)
        const titleMatch = jobDescription.match(/Position:\s*([^\n]+)/i);
        const jobTitle = titleMatch ? titleMatch[1].trim() : "Interview Position";

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            title: jobTitle,
            resume: resumeContent,
            selfDescription,
            jobDescription,
            matchScore: interViewReportByAi.matchPercentage || interViewReportByAi.score || 0,
            technicalQuestions: interViewReportByAi.technicalQuestions || [],
            behavioralQuestions: interViewReportByAi.behavioralQuestions || [],
            preparationPlan: interViewReportByAi.roadmap || [],
            skillGaps: interViewReportByAi.weaknesses?.map((weakness, idx) => ({
                skill: weakness,
                severity: idx < 1 ? "high" : idx < 2 ? "medium" : "low"
            })) || []
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Error in generateInterviewReportController:", error)
        res.status(500).json({
            message: error.message || "Failed to generate interview report"
        })
    }

}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePDF({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }