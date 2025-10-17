function Bans({ selectedChampion, lockedChampions = [], currentPhase, side }) {
    const phaseToIndex = {
        blueBan1: 0,
        blueBan2: 1,
        blueBan3: 2,
        blueBan4: 3,
        blueBan5: 4,
        redBan1: 0,
        redBan2: 1,
        redBan3: 2,
        redBan4: 3,
        redBan5: 4
    };

    const activeIndex = currentPhase?.startsWith(side) ? phaseToIndex[currentPhase] : null;

    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '3px',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '600px', // opzionale
                margin: '0 auto'
            }}
        >
            {lockedChampions.map((ban, index) => {
                const isActive = index === activeIndex;
                const champToShow = ban.champ
                    ? ban.champ
                    : isActive && selectedChampion
                        ? selectedChampion
                        : null;

                return (
                    <div
                        key={index}
                        style={{
                            flex: '1 1 0',               // permette a tutti i box di adattarsi uniformemente
                            minWidth: '40px',            // minimo 40px
                            maxWidth: '85px',            // massimo 85px
                            aspectRatio: '1 / 1',        // mantiene il box quadrato
                            width: '100%',               // necessario in flexbox per rispettare min/max
                            border: isActive ? '3px solid limegreen' : '2px solid #555',
                            boxShadow: isActive ? '0 0 5px limegreen' : 'none',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#333',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >

                        <img
                            src={
                                champToShow
                                    ? `/img/champions/${champToShow.img || 'champless.png'}`
                                    : '/img/champions/champless.png'
                            }
                            alt={champToShow?.name || 'No Champion'}
                            style={{
                                width: '95%',
                                height: '95%',
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
}
export default Bans