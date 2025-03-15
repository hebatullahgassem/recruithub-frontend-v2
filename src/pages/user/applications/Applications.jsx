import { Link } from "react-router"

function UserApplications() {
    return (
        <header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ fontSize: '2rem', margin: '1rem' }}>UserApplications</h1>
            <Link to="/applicant/applications/1"><button>Single Application</button></Link>
        </header>
    )

}

export default UserApplications