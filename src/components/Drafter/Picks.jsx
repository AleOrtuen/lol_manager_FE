import Champions from "../Champions";

function Picks({champions = []}) {


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
            {rolesData.map((_, index) => {
                const champion = champions[index];

                return (
                    <div className="row justify-content-center" key={index}>
                        <div
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
                            {champion ? (
                                <Champions />
                            ) : (
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
                            )}
                        </div>
                    </div>
                );
            })}
        </>
    );
}

export default Picks