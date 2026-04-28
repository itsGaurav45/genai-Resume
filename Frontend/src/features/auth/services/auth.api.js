import api from "../../../services/api";


export async function register({ username, email, password }) {
    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })

        const { token, user } = response.data
        if (token) {
            localStorage.setItem("token", token)
        }

        return response.data

    } catch (err) {
        console.log(err)
        throw err
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", {
            email, password
        })

        const { token, user } = response.data
        if (token) {
            localStorage.setItem("token", token)
        }

        return response.data

    } catch (err) {
        console.log(err)
        throw err
    }
}

export async function logout() {
    try {
        const response = await api.get("/api/auth/logout")
        localStorage.removeItem("token")
        return response.data
    } catch (err) {
        localStorage.removeItem("token")
    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/get-me")
        return response.data
    } catch (err) {
        console.log(err)
        throw err
    }
}