const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()
app.set("trust proxy", 1) // Trust first proxy (necessary for Render/Vercel)
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")

// 🔒 Phase 1: Security Headers
app.use(helmet())

// 🔒 Phase 1: Rate Limiting (Prevents API abuse/spam)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { message: "Too many requests from this IP, please try again after 15 minutes" }
})
app.use("/api/", limiter) // Apply rate limiting to all /api/ routes
app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "https://genai-resume-sage.vercel.app"
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
            return callback(null, true)
        }
        return callback(new Error("Not allowed by CORS"))
    },
    credentials: true
}))


/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes.js")

// Root Health Check for Keep-Alive
app.get("/", (req, res) => {
    res.status(200).json({ status: "ok", message: "GenAI Resume Analyzer Backend is running" })
})



/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)
    



module.exports = app
