import { useNavigate } from "react-router";
import JobCard from "../../../components/job/JobCard"

function CompanyJobs() {
    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h1 style={{ fontSize: '2rem', margin: '1rem' }}>CompanyJob</h1>
        </header>
        <JobCard job={{
            _id: '1',
            title: 'Software Engineer',
            companyName: 'Vois',
            type: 'Full-time',
            workStyle: 'Onsite',
            location: 'New York, NY',
            companyLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhO-fRJWu5psjEYHnr8-cuBso-97hktHGIRwBXmSiDHN8w8-FX8G4eemvPvt6kgan2kTc&usqp=CAU',
            description: 'Develop and maintain web applications.',
            keywords: ['JavaScript', 'React', 'Node.js'],
        }} user={"company"}/>
        </div>
    )
}

export default CompanyJobs