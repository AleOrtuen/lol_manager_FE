// Score.js
import React, { useEffect, useState } from "react";

function Score({ game, wins, side }) {
    const [gameStyle, setGameStyle] = useState(0);

    useEffect(() => {
        switch (game?.style) {
            case "bo1": setGameStyle(1); break;
            case "bo3": setGameStyle(2); break;
            case "bo5": setGameStyle(3); break;
            default: setGameStyle(0);
        }
    }, [game]);

    return (
        <div className={`score-container ${side}`}>
            {[...Array(gameStyle)].map((_, index) => (
                <div
                    key={index}
                    className={`score-box ${side} ${index < wins ? 'win' : ''}`}
                />
            ))}
        </div>
    );
}

export default Score;

