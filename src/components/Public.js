import { Link } from 'react-router-dom'

const Public = () => {
    const content = (
        <section className="public">
            <header>
                <h1>Welcome to <span className="nowrap">ohMyBug!</span></h1>
            </header>
            <main className="public__main">

                <p>
                Simple bug-trackng tool for a small team.
                <br/><br/>
                Capture bugs anywhere in your software projects with ohMyBug.
                <br/><br/>
                Once you've identified a bug, create an issue and add all relevant details.
                <br/><br/>
                Assign issue to the right person.
                <br/><br/>
                Make it simple for all relevant stakeholders to check the status of open issues at any time.
                </p>
                <br />
                <p className="italic">Creator: Valerie Kunichik</p>
            </main>
            <footer>
                <Link to="/login">Employee Login</Link>
            </footer>
        </section>

    )
    return content
}
export default Public