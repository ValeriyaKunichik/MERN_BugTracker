import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import jwtDecode from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isManager = false
    let isAdmin = false
    let isTester = false
    let isDeveloper = false
    let isEmployee = false
    let status = "Employee"

    if (token) {
        const decoded = jwtDecode(token)
        const { username, roles } = decoded.UserInfo

        isManager = roles.includes('Manager')
        isAdmin = roles.includes('Admin')
        isDeveloper = roles.includes('Developer')
        isTester= roles.includes('Tester')
        isEmployee= roles.includes('Employee')

        if (isManager) status = "Manager"
        if (isAdmin) status = "Admin"
        if (isTester) status = "Tester"
        if (isDeveloper) status = "Developer"
        if (isEmployee) status = "Employee"

        return { username, roles, status, isManager, isAdmin, isDeveloper, isTester, isEmployee }
    }

    return { username: '', roles: [], isManager, isAdmin, isDeveloper, isTester, isEmployee, status }
}
export default useAuth