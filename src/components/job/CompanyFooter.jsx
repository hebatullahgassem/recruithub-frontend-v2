function CompanyFooter() {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p>Applied</p>
                    <p>50</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p>Tech Quiz</p>
                    <p>13</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p>Tech Interview</p>
                    <p>7</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p>HR Interview</p>
                    <p>2</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p>Offer</p>
                    <p>0</p>
                </div>
            </div>
        </div>
    );
}

export default CompanyFooter;