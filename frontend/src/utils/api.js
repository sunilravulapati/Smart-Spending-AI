const BASE = 'http://localhost:5000/api'

export const register = async (email, password) => {
    const res = await fetch(`${BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',   // tells browser to send/receive cookies
        body: JSON.stringify({ email, password })
    })
    return res.json()
}

export const login = async (email, password) => {
    const res = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
    })
    return res.json()
}

export const logout = async () => {
    await fetch(`${BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
    })
}

export const getMe = async () => {
    const res = await fetch(`${BASE}/auth/me`, {
        credentials: 'include'
    })
    if (!res.ok) return null
    return res.json()
}

export const loadData = async () => {
    const res = await fetch(`${BASE}/data`, {
        credentials: 'include'   // no Authorization header needed anymore
    })
    return res.json()
}

export const saveData = async (data) => {
    await fetch(`${BASE}/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
    })
}