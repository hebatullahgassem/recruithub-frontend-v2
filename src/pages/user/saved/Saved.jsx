import JobCard from "../../../components/job/JobCard"

function UserSaved() {
    return (
        <div className="d-flex flex-column align-items-center w-100">
            <h1>User Saved</h1>
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
        }} user={"user"}/>
        </div>
    )

}

export default UserSaved