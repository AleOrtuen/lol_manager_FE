import React from "react";

function FearlessBans({lockedChampions = [], game}) {

    const isFearless = game?.fearless === true;
    const isBo3 = game?.style === 'bo3';
    const isBo5 = game?.style === 'bo5';

    let totalSlots = 10;
    let useDoubleRow = false;

    if (isFearless && isBo3) {
        totalSlots = 10;
        useDoubleRow = false;
    } else if (isFearless && isBo5) {
        totalSlots = 20;
        useDoubleRow = true;
    }

    // Crea un array con il numero corretto di slot
    const slotsArray = Array.from({ length: totalSlots }, (_, i) =>
        lockedChampions[i] || { champ: null }
    );

    const renderSlot = (ban, index) => {
        const champToShow = ban.champ || null;
        const isBanned = !!champToShow;

        return (
            <div
                key={index}
                style={{
                    position: 'relative',
                    flex: '1 1 0',
                    minWidth: '40px',
                    maxWidth: useDoubleRow ? '75px' : '85px',
                    aspectRatio: '1 / 1',
                    width: '100%',
                    border: '2px solid #555',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#333',
                    borderRadius: '8px',
                    cursor: 'default',
                    overflow: 'hidden'
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

                {isBanned && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '80%',
                            height: '3px',
                            backgroundColor: 'white',
                            transform: 'translate(-50%, -50%) rotate(-45deg)',
                            pointerEvents: 'none'
                        }}
                    />
                )}
            </div>
        );
    };

    if (useDoubleRow) {
        // Layout a due righe per Bo5 fearless (2x10)
        const firstRow = slotsArray.slice(0, 10);
        const secondRow = slotsArray.slice(10, 20);

        return (
            <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                <div
                    style={{
                        display: 'flex',
                        gap: '3px',
                        justifyContent: 'center',
                        width: '100%',
                        marginBottom: '3px'
                    }}
                >
                    {firstRow.map((ban, index) => renderSlot(ban, index))}
                </div>
                <div
                    style={{
                        display: 'flex',
                        gap: '3px',
                        justifyContent: 'center',
                        width: '100%'
                    }}
                >
                    {secondRow.map((ban, index) => renderSlot(ban, index + 10))}
                </div>
            </div>
        );
    }

    // Layout a singola riga per Bo3 fearless (10 slot)
    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '3px',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '800px',
                margin: '0 auto'
            }}
        >
            {slotsArray.map((ban, index) => renderSlot(ban, index))}
        </div>
    );
}

// Demo component per testing
function App() {
    const [gameMode, setGameMode] = React.useState('bo3Fearless');

    const gameConfigs = {
        bo3Fearless: { fearless: true, style: 'bo3' },
        bo5Fearless: { fearless: true, style: 'bo5' }
    };

    const demoChampions = [
        { name: 'Aatrox', img: 'Aatrox.png' },
        { name: 'Ahri', img: 'Ahri.png' },
        { name: 'Akali', img: 'Akali.png' }
    ];

    const lockedChampions = [
        { champ: demoChampions[0] },
        { champ: demoChampions[1] },
        { champ: demoChampions[2] }
    ];

    return (
        <div style={{ padding: '20px', backgroundColor: '#1a1a1a', minHeight: '100vh', color: 'white' }}>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h2>Bans Component Demo</h2>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
                    <button onClick={() => setGameMode('bo3Fearless')} style={{ padding: '8px 16px' }}>
                        Bo3 Fearless (10 slots)
                    </button>
                    <button onClick={() => setGameMode('bo5Fearless')} style={{ padding: '8px 16px' }}>
                        Bo5 Fearless (20 slots)
                    </button>
                </div>
                <p style={{ marginTop: '15px', color: '#aaa' }}>
                    Modalità attuale: {gameMode} - Style: {gameConfigs[gameMode].style}
                </p>
            </div>

            <Bans
                lockedChampions={lockedChampions}
                game={gameConfigs[gameMode]}
            />
        </div>
    );
}

export default FearlessBans