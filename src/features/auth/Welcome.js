import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const Welcome = () => {

    const { username, isManager, isAdmin, isTester } = useAuth()

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(date)

    const content = (
        <section className="welcome">

            <p className="date">{today}</p>

            <h1>Welcome, {username}!</h1>

            <p><Link to="/dash/issues">View Issues</Link></p>

            {(isManager || isAdmin || isTester ) && <p><Link to="/dash/issues/new">Add New Issue Report</Link></p>}

            {(isManager || isAdmin) && <p><Link to="/dash/users">View User Settings</Link></p>}

            {(isAdmin) && <p><Link to="/dash/users/new">Add New User</Link></p>}

        </section>
    )

    return content
}
export default Welcome