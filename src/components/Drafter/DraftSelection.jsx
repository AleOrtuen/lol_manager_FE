import React, { useEffect, useState } from 'react';

function DraftSelection({ game, draftList = [], onSelect }) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (draftList.length > 0) {
            const firstIncomplete = draftList.findIndex(d => d.winner === null);
            const defaultIndex = firstIncomplete !== -1 ? firstIncomplete : 0;
            setSelectedIndex(defaultIndex);
            onSelect(defaultIndex); // notifico al parent
        }
    }, [draftList, onSelect]);

    const getNumberOfGames = () => {
        switch (game?.style) {
            case 'bo1':
                return 1;
            case 'bo3':
                return 3;
            case 'bo5':
                return 5;
            default:
                return 0;
        }
    };

    const numberOfGames = getNumberOfGames();

    return (
        <div className="btn-group my-2" role="group" aria-label="Draft selection">
            {[...Array(numberOfGames)].map((_, index) => (
                <button
                    key={index}
                    type="button"
                    className={`btn ${index === selectedIndex ? 'btn-secondary btn-sm' : 'btn-outline-secondary btn-sm'}`}
                    onClick={() => {
                        setSelectedIndex(index);
                        onSelect(index);
                    }}
                >
                    GAME {index + 1}
                </button>
            ))}
        </div>
    );
}

export default DraftSelection;
