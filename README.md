🚀 GenAI Resume Analyzer & Interview Assistant

An advanced AI-powered Resume Analyzer & Interview Report Generator built using MERN stack and Google Generative AI. This application helps users analyze their resumes, match them with job descriptions, and generate detailed interview insights.

📌 Project Description

This project is designed to solve a real-world problem:
👉 “Why resumes get rejected and how to improve them intelligently.”

Users can upload their resume, provide a job description, and get:

📊 AI-based resume evaluation
🎯 Job-role matching insights
🧠 Personalized improvement suggestions
🧾 Interview-ready report generation
✨ Key Features (Based on Your Code)
🔐 Authentication System
JWT-based authentication
Token stored in cookies
Logout with token blacklisting
Protected routes using middleware
📄 Resume Processing
Upload resume (PDF)
Backend handles file processing (Multer)
Resume used as input for AI analysis
🤖 AI Integration (Core Feature)
Google Generative AI (Gemini API)
Generates:
Resume feedback
Skill gap analysis
Improvement suggestions
Interview report
📊 Interview Report System
Generate structured interview reports
Store reports in database
Fetch:
All reports
Report by ID
📥 PDF Generation
Generate downloadable resume/interview reports using Puppeteer
🛠️ Tech Stack
Frontend
React.js
Axios
Context API
React Router
Backend
Node.js
Express.js
Database
MongoDB
AI & Tools
Google Generative AI (Gemini)
Puppeteer (PDF generation)
Multer (file uploads)
Zod (validation)
📂 Project Structure (Based on Your Repo)
genai-Resume/
│
├── Backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   │   └── auth.middleware.js   ← JWT + blacklist logic
│   ├── services/
│   │   └── interview.api.js     ← AI + report logic
│   └── config/
│
├── Frontend/
│   ├── src/
│   │   ├── hooks/
│   │   │   └── useInterview.js  ← API integration
│   │   ├── context/
│   │   ├── pages/
│   │   └── components/
│
└── README.md
⚙️ Setup Instructions
1️⃣ Clone Repo
git clone https://github.com/itsGaurav45/genai-Resume.git
cd genai-Resume
2️⃣ Backend Setup
cd Backend
npm install

Create .env:

PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
GOOGLE_GENAI_API_KEY=your_api_key

Run backend:

npm run dev
3️⃣ Frontend Setup
cd Frontend
npm install

Create .env:

VITE_API_URL=http://localhost:3000

Run frontend:

npm run dev
🔄 API Flow (Based on Your Code)
1. Generate Interview Report
Upload resume + job description + self description
AI processes input
Returns structured report
2. Fetch Reports
Get all reports
Get report by ID
3. Generate PDF
Convert report → PDF using Puppeteer
🧠 How AI Works in Your Project
Resume + Job Description sent to backend
Structured prompt created using Zod schema
Gemini processes data
Returns:
Score
Missing skills
Suggestions
Interview Q&A
🚨 Common Issues (Based on Your Errors)
❌ 401 Unauthorized (You faced this)
Token not sent in cookies
withCredentials: true missing
Backend CORS misconfigured
✅ Fix
const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});
🚀 Future Enhancements
📊 ATS Score system
🧠 RAG-based resume improvement
📱 Fully responsive UI
🌍 Multi-language support
🔗 LinkedIn profile analyzer
👨‍💻 Author

Gaurav Chaubey
🔗 GitHub: https://github.com/itsGaurav45

⭐ Why This Project Stands Out
Real-world problem solving
Full-stack + AI integration
Authentication + security handled
PDF generation (production-level feature)
Clean modular architecture
