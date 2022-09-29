import { useState, useEffect } from "react"
import { useUpdateIssueMutation, useDeleteIssueMutation } from "./issuesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"

const EditIssueForm = ({ issue, users }) => {

    const { username, isManager, isAdmin, isTester, isDeveloper } = useAuth()

    const [updateIssue, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateIssueMutation()

    const [deleteIssue, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteIssueMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState(issue.title)
    const [createdby, setCreatedBy] = useState(issue.createdby)
    const [type, setType] = useState(issue.type)
    const [priority, setPriority] = useState(issue.priority)
    const [environment, setEnvironment] = useState(issue.environment)
    const [actions, setActions] = useState(issue.actions)
    const [expected, setExpected] = useState(issue.expected)
    const [actual, setActual] = useState(issue.actual)
    const [userId, setUserId] = useState(issue.user)
    const [completed, setCompleted] = useState(issue.completed)

    useEffect(() => {

        if (isSuccess || isDelSuccess) {
            setCreatedBy('')
            setTitle('')
            setActions('')
            setUserId('')
            setType('')
            setPriority('')
            setEnvironment('')
            setExpected('')
            setActual('')
            navigate('/dash/issues')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onActionsChanged = e => setActions(e.target.value)
    const onUserIdChanged = e => setUserId(e.target.value)
    const onTypeChanged = e => setType(e.target.value)
    const onPriorityChanged = e => setPriority(e.target.value)
    const onEnvironmentChanged = e => setEnvironment(e.target.value)
    const onExpectedChanged = e => setExpected(e.target.value)
    const onActChanged = e => setActual(e.target.value)
    const onCompletedChanged = e => setCompleted(prev => !prev)
    

    const canSave = [title, actions, userId, type!=="Select", priority!=="Select", userId!=='Select', (isTester&&issue.createdby === username) || isDeveloper || isManager].every(Boolean) && !isLoading

    const onSaveIssueClicked = async (e) => {
        if (canSave) {
            await updateIssue({ id: issue.id, createdby, user: userId, title, type, priority, environment, actions,expected, actual, completed })
        }
    }

    const onDeleteIssueClicked = async () => {
        await deleteIssue({ id: issue.id })
    }

    const created = new Date(issue.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(issue.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    
    const options=[<option
    key='0'
    value="Select"
    > Select</option >]
     options.push(users.filter(user => user.roles[0]==='Developer').map(user => {
        return (
            <option
                key={user.id}
                value={user.id}

            > {user.username}</option >
        )
    }))
    
    const typesOptions = ['Select','Functional', 'UI', 'Content', 'Performance', 'Usability',  'Crash'].map(type => {
        return (
            <option
                key={`${type}`}
                value={type}
            > {type}</option >
        )
    })
    

    const prioritiesOptions = ['Select','Low', 'Medium', 'High', 'Critical'].map(priority => {
        return (
            <option
                key={`${priority}`}
                value={priority}
            > {priority}</option >
        )
    })

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''


    let deleteButton = null
    if (isManager || isAdmin) {
        deleteButton = (
            <button
                className="icon-button"
                title="Delete"
                onClick={onDeleteIssueClicked}
            >
                <FontAwesomeIcon icon={faTrashCan} />
            </button>
        )
    }

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit Issue #{issue.ticket}</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveIssueClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        {deleteButton}
                    </div>
                </div>

                <label className="form__label" htmlFor="title">
                    Issue Title:</label>
                <input
                    className={`form__input `}
                    id="title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={onTitleChanged}
                />

                <label className="form__label form__checkbox-container" htmlFor="type">
                    Type:</label>
                    <select
                    id="type"
                    name="type"
                    className="form__select"
                    value={type}
                    onChange={onTypeChanged}
                >
                    {typesOptions}
                </select>

                <label className="form__label form__checkbox-container" htmlFor="priority">
                    Priority:</label>
                    <select
                    id="priority"
                    name="priority"
                    className="form__select"
                    value={priority}
                    onChange={onPriorityChanged}
                >
                    {prioritiesOptions}
                </select>

                <label className="form__label" htmlFor="environment">
                    Environment:</label>
                <input
                    className={`form__input`}
                    id="environment"
                    name="environment"
                    type="text"
                    autoComplete="off"
                    value={environment}
                    onChange={onEnvironmentChanged}
                />

                <label className="form__label" htmlFor="actions">
                    Actions Performed:</label>
                <textarea
                    className={`form__input form__input--text }`}
                    id="actions"
                    name="actions"
                    value={actions}
                    onChange={onActionsChanged}
                />

                <label className="form__label" htmlFor="expected">
                    Expected result:</label>
                <textarea
                    className={`form__input form__input--text }`}
                    id="expected"
                    name="expected"
                    value={expected}
                    onChange={onExpectedChanged}
                />

                <label className="form__label" htmlFor="actual">
                    Actual result:</label>
                <textarea
                    className={`form__input form__input--text }`}
                    id="actual"
                    name="actual"
                    value={actual}
                    onChange={onActChanged}
                />


                <div className="form__row">
                    <div className="form__divider">
                        {(isManager|| isAdmin || isDeveloper)&&<label className="form__label form__checkbox-container" htmlFor="issue-completed">
                            WORK COMPLETE:
                            <input
                                className="form__checkbox"
                                id="issue-completed"
                                name="completed"
                                type="checkbox"
                                checked={completed}
                                onChange={onCompletedChanged}
                            />
                        </label>}

                        <label className="form__label form__checkbox-container" htmlFor="username">
                    ASSIGNED TO:</label>
                    <select
                    id="username"
                    name="username"
                    className="form__select"
                    value={userId}
                    onChange={onUserIdChanged}
                    
                >
                    {options}
                </select>
                    </div>
                    <div className="form__divider">
                        <p className="form__created">Created:<br />{created}</p>
                        <p className="form__updated">Updated:<br />{updated}</p>
                    </div>
                </div>
            </form>
        </>
    )

    return content
}

export default EditIssueForm