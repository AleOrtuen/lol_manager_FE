function Bans({ selectedChampion, lockedChampions = [], currentPhase, side, order= false }) {
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

    const activeIndex = currentPhase?.startsWith(side)
        ? phaseToIndex[currentPhase]
        : null;

    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '3px',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '600px',
                margin: '0 auto',
                flexDirection: order ? 'row-reverse' : 'row'
            }}
        >
            {lockedChampions.map((ban, index) => {
                const isActive = index === activeIndex;
                const champToShow = ban.champ
                    ? ban.champ
                    : isActive && selectedChampion
                        ? selectedChampion
                        : null;

                const isBanned = !!champToShow;

                return (
                    <div
                        key={index}
                        style={{
                            position: 'relative',
                            flex: '1 1 0',
                            minWidth: '40px',
                            maxWidth: '85px',
                            aspectRatio: '1 / 1',
                            width: '100%',
                            border: isActive ? '3px solid limegreen' : '2px solid #555',
                            boxShadow: isActive ? '0 0 5px limegreen' : 'none',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#333',
                            borderRadius: '5px',
                            cursor: 'default',
                            overflow: 'hidden'
                        }}
                    >
                        <img
                            src={
                                champToShow
                                    ? `/img/champions/${champToShow.img.toLowerCase() || 'champless.png'}`
                                    : '/img/champions/champless.png'
                            }
                            alt={champToShow?.name || 'No Champion'}
                            style={{
                                width: '95%',
                                height: '95%',
                                objectFit: 'contain',
                                borderRadius: '5px'
                            }}
                        />

                        {isBanned && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    width: '80%',        // lunghezza della diagonale
                                    height: '3px',       // spessore
                                    backgroundColor: 'white',
                                    transform: 'translate(-50%, -50%) rotate(-45deg)', // centrata perfettamente
                                    pointerEvents: 'none'
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default Bans;
