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
        <>
            {lockedChampions.map((ban, index) => {
                const isActive = index === activeIndex;
                const champToShow = ban.champ
                    ? ban.champ
                    : isActive && selectedChampion
                        ? selectedChampion
                        : null;

                return (
                    <div key={index} style={{
                        width: '85px',
                        height: '85px',
                        border: isActive ? '3px solid limegreen' : '2px solid #555',
                        boxShadow: isActive ? '0 0 5px limegreen' : 'none',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#333',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        marginBottom: '10px'
                    }}>
                        <img
                            src={
                                champToShow
                                    ? `/img/champions/${champToShow.img || 'champless.png'}`
                                    : '/img/champions/champless.png'
                            }
                            alt={champToShow?.name || 'No Champion'}
                            style={{ width: '67px', height: '67px', borderRadius: '8px' }}
                        />
                    </div>
                );
            })}
        </>
    );
}


export default Bans