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
        <div>
            {draft.winner !== null ?
                <h5>{draft.winner.name} winner</h5>
                :
                <>
                    <h5>Select winner</h5>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => handleWinnerSelection("blue")}
                    >
                        Blue side
                    </button>
                    <> </>
                    <button
                        className="btn btn-danger btn-lg"
                        onClick={() => handleWinnerSelection("red")}
                    >
                        Red side
                    </button>
                </>
            }
        </div>
    )
}

export default WinnerSelection