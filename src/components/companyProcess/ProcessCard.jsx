import ApplicantsTable from "./ApplicantsTable"

function ProcessCard({column, phases}) {
    const status = ["Applied", "Technical Assessment", "Technical Interview", "Hr Interview", "Offer"]
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', maxWidth: 'inherit' }}>
            <h1 style={{ fontSize: '2rem', margin: '1rem' }}>{status[column-1]}</h1>
            <ApplicantsTable phase={column}/>
        </div>
    )
}

export default ProcessCard