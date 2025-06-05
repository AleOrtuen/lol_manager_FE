function Picks({ selectedChampion, lockedChampions = [], currentPhase }) {
    const phaseToIndex = {
        bluePick1: 0,
        bluePick2: 1,
        bluePick3: 2,
        bluePick4: 3,
        bluePick5: 4,
        redPick1: 0,
        redPick2: 1,
        redPick3: 2,
        redPick4: 3,
        redPick5: 4
    };

    const activeIndex = phaseToIndex[currentPhase];

    return (
        <div 
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            {lockedChampions.map((pick, index) => {
                const isActive = index === activeIndex;
                const champToShow = pick.champ
                    ? pick.champ
                    : isActive && selectedChampion
                        ? selectedChampion
                        : null;

                return (
                    <div 
                        key={index} 
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
                            src={
                                champToShow
                                    ? `/img/champions/${champToShow.img || 'champless.png'}`
                                    : '/img/champions/champless.png'
                            }
                            alt={champToShow?.name || 'No Champion'}
                            style={{ 
                                width: '67px', 
                                height: '67px', 
                                borderRadius: '8px',
                                objectFit: 'cover' 
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
}

export default Picks