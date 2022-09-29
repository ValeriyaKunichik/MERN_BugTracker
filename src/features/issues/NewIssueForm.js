import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewIssueMutation } from "./issuesApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"

const NewIssueForm = ({ users }) => {
    
    const { username } = useAuth()
    const [addNewIssue, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewIssueMutation()

    const navigate = useNavigate()
    
    const [createdby, setCreatedBy] = useState(username)
    const [title, setTitle] = useState('')
    const [type, setType] = useState('')
    const [priority, setPriority] = useState('')
    const [environment, setEnvironment] = useState('')
    const [actions, setActions] = useState('')
    const [expected, setExpected] = useState('')
    const [actual, setActual] = useState('')
    const [userId, setUserId] = useState('')

    useEffect(() => {
        if (isSuccess) {
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
    }, [isSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onActionsChanged = e => setActions(e.target.value)
    const onUserIdChanged = e => setUserId(e.target.value)
    const onTypeChanged = e => setType(e.target.value)
    const onPriorityChanged = e => setPriority(e.target.value)
    const onEnvironmentChanged = e => setEnvironment(e.target.value)
    const onExpectedChanged = e => setExpected(e.target.value)
    const onActChanged = e => setActual(e.target.value)
    const canSave = [title, actions, userId, type!=="Select", priority!=="Select", userId!=="Select"&&userId!==''].every(Boolean) && !isLoading

    const onSaveIssueClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewIssue({ user: userId, createdby, title, type, priority, environment, actions,expected, actual })
        }
    }
    
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
   
    const errClass = isError ? "errmsg" : "offscreen"

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveIssueClicked}>
                <div className="form__title-row">
                    <h2>New Issue</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
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

            </form>
        </>
    )

    return content
}

export default NewIssueForm