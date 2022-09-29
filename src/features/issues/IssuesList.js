import { useGetIssuesQuery } from "./issuesApiSlice"
import Issue from "./Issue"
import useAuth from "../../hooks/useAuth"

const IssuesList = () => {

    const { username, isManager, isAdmin, isTester, isEmployee } = useAuth()

    const {
        data: issues,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetIssuesQuery('issuesList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids, entities } = issues

        let filteredIds
        if (isManager || isAdmin || isTester || isEmployee) {
            filteredIds = [...ids]
        } else {
            filteredIds = ids.filter(issueId => entities[issueId].username === username)
        }

        const tableContent = ids?.length && filteredIds.map(issueId => <Issue key={issueId} issueId={issueId} />)

        content = (
            <table className="table table--issues">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th issue__status">Status</th>
                        <th scope="col" className="table__th issue__created">Created</th>
                        <th scope="col" className="table__th issue__createdby">Created by</th>
                        <th scope="col" className="table__th issue__updated">Updated</th>
                        <th scope="col" className="table__th issue__title">Title</th>
                        <th scope="col" className="table__th issue__priority">Priority</th> 
                        <th scope="col" className="table__th issue__type">Type</th>
                        <th scope="col" className="table__th issue__username">Assigned to</th>
                        <th scope="col" className="table__th issue__edit">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content
}
export default IssuesList