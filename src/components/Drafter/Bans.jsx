function Bans() {
    //LISTA RUOLI E IMG
    const rolesData = [
        { role: 'top' },
        { role: 'jng' },
        { role: 'mid' },
        { role: 'adc' },
        { role: 'sup' }
    ];

    return (
        <>
            {rolesData.map((role) =>
                <div
                    key={role.role}
                    style={{
                        width: '85px',
                        height: '85px',
                        border: '2px solid #555',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#333',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        marginBottom: '10px'
                    }}
                >
                    <img
                        src="/img/champions/champless.png"
                        alt="No Champion"
                        style={{
                            width: '67px',
                            height: '67px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                        }}
                    />
                </div>
            )}
        </>
    )
}

export default Bans