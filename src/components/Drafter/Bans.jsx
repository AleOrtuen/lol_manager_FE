function Bans({ selectedChampion, lockedChampions = {}, currentPhase }) {

    const phaseToSlot = {
        blueBan1: 'ban1',
        blueBan2: 'ban2',
        blueBan3: 'ban3',
        blueBan4: 'ban4',
        blueBan5: 'ban5',
        redBan1: 'ban1',
        redBan2: 'ban2',
        redBan3: 'ban3',
        redBan4: 'ban4',
        redBan5: 'ban5'
    };

    const slotOrder = ['ban1', 'ban2', 'ban3', 'ban4', 'ban5'];
    const activeSlot = phaseToSlot[currentPhase];

    return (
        <>
            {slotOrder.map((slot) => {
                const champ = lockedChampions[slot]?.champ;

                const isActive = slot === activeSlot;

                const champToShow = champ
                    ? champ
                    : isActive && selectedChampion
                        ? selectedChampion
                        : null;

                return (
                    <div key={slot} style={{
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