import { useState } from "react";
import { Link } from "react-router";

function Navbar() {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleNavbar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Recruitment Platform</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleNavbar}
                    aria-controls="navbarSupportedContent"
                    aria-expanded={!isCollapsed}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${isCollapsed ? '' : 'show'}`} id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">

                            <Link to="/applicant"><a className="nav-link active" aria-current="page">Home</a></Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/applicant/jobs"><a className="nav-link active" aria-current="page">Jobs</a></Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/applicant/saved"><a className="nav-link active" aria-current="page">Saved</a></Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/applicant/applications"><a className="nav-link active" aria-current="page">Applications</a></Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
