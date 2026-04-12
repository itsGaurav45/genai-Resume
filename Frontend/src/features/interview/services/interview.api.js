import axios from "axios";

const api = axios.create({
    baseURL: "https://genai-resume-backend-kxru.onrender.com",
    withCredentials: true,
})

// Interceptor to handle FormData properly
api.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        // Delete Content-Type so browser can set it with proper boundary
        delete config.headers["Content-Type"]
    }
    return config
}, (error) => {
    return Promise.reject(error)
})


/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    if (resumeFile) {
        formData.append("resume", resumeFile)
    }

    const response = await api.post("/api/interview/", formData)

    return response.data

}


/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)

    return response.data
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")

    return response.data
}


/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    })

    return response.data
}
