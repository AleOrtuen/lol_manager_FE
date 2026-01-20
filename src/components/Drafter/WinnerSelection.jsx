import { draftUpdate, draftWinner } from "../../service/draftService.js";

function WinnerSelection({ draft }) {

    const handleWinnerSelection = (side) => {
        const confirmed = window.confirm("Confirm " + side + " team as winner?");
        if (!confirmed) return;

        const updatedDraft = {
            ...draft,
            winner: side === 'blue' ? draft.teamBlue : draft.teamRed
        }

        draftWinner(updatedDraft)
            .then((response) => {
            })
            .catch(error => {
                console.log(error.response.data.response);
            })
    }

    return (
        <div className="lol-draft-card">
            <div className="lol-header">
                <span className="lol-title">Winner Selection</span>
            </div>
            {draft.winner ? (
                <div className="lol-section">
                    <div className="lol-section-title">
                        Winner: {draft.winner.name}
                    </div>
                </div>
            ) : (
                <>
                    <div className="lol-section">
                        <div className="lol-section-title">Select Winner</div>
                        <div className="lol-button-row">
                            <button
                                className="lol-btn blue"
                                onClick={() => handleWinnerSelection("blue")}
                            >
                                {draft.teamBlue?.name || "Blue side"}
                            </button>
                            <button
                                className="lol-btn red"
                                onClick={() => handleWinnerSelection("red")}
                            >
                                {draft.teamRed?.name || "Red side"}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );

}

export default WinnerSelection