import React from 'react';

function Picks({ selectedChampion, lockedChampions = [], currentPhase, side }) {
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

    const activeIndex = currentPhase?.startsWith(side)
        ? phaseToIndex[currentPhase]
        : null;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
            }}
        >
            {lockedChampions.map((pick, index) => {
                const isActive = index === activeIndex;

                const champToShow = pick.champ
                    ? pick.champ
                    : isActive && selectedChampion
                        ? selectedChampion
                        : null;

                let imgFile = champToShow?.img || 'champless.png';
                if (imgFile !== 'champless.png') {
                    imgFile = imgFile.replace(/\.(webp|png)$/i, '.jpg');
                }

                if (!imgFile.includes('.')) {
                    imgFile = imgFile + '.jpg';
                }

                return (
                    <div
                        key={index}
                        style={{
                            width: '100%',
                            maxWidth: '186px',
                            aspectRatio: '186 / 123',
                            minWidth: '100px',
                            minHeight: '70px',
                            border: isActive ? '3px solid limegreen' : '2px solid #555',
                            boxShadow: isActive ? '0 0 5px limegreen' : 'none',
                            backgroundColor: '#333',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            marginTop: index === 3 ? '15px' : '3px',
                            marginBottom: '3px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexShrink: 0
                        }}
                    >
                        <img
                            src={`/img/banners/${imgFile}`}
                            alt={champToShow?.name || 'No Champion'}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                width: 'auto',
                                height: 'auto',
                                minWidth: '100px',
                                minHeight: '70px',
                                objectFit: 'cover',
                                borderRadius: '8px'
                            }}
                        />
                    </div>

                );
            })}
        </div>
    );
}

export default Picks;
