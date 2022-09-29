import { useParams } from 'react-router-dom'
import EditIssueForm from './EditIssueForm'
import { useGetIssuesQuery } from './issuesApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const EditIssue = () => {
    useTitle('techIssues: Edit Issue')

    const { id } = useParams()

    const { username, isManager, isAdmin, isTester, isDeveloper } = useAuth()

    const { issue } = useGetIssuesQuery("issuesList", {
        selectFromResult: ({ data }) => ({
            issue: data?.entities[id]
        }),
    })

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        }),
    })

    if (!issue || !users?.length) return <PulseLoader color={"#FFF"} />


    if (!isManager && !isAdmin && !isTester && !isDeveloper) {
        if (issue.username !== username) {
            return <p className="errmsg">No access</p>
        }
    }

    const content = <EditIssueForm issue={issue} users={users} />

    return content
}
export default EditIssue