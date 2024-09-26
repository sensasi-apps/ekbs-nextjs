export function logout(setUser: (user: null) => void) {
    localStorage.removeItem('currentAuthInfo')
    setUser(null)
}
