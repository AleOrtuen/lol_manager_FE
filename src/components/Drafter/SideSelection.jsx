import { useParams } from "react-router-dom";
import {draftSave, draftUpdate} from "../../service/draftService.js";

function SideSelection({ game, draft }) {

    const { idRoom, role } = useParams();

    let yourTeam, oppositeTeam;
    if (role === "player1") {
        yourTeam = game.team1;
        oppositeTeam = game.team2;
    } else {
        yourTeam = game.team2;
        oppositeTeam = game.team1;
    }

    const handleSideSelection = (side) => {
        const confirmed = window.confirm("Confirm " + side + " side?");
        if (!confirmed) return;
        const teamSelecting = side === "blue" ? "teamBlue" : "teamRed";
        const teamWaiting = side === "blue" ? "teamRed" : "teamBlue";

        const updateDraft = {
            idDraft: draft.idDraft,
            game: game,
            [teamSelecting]: yourTeam,
            [teamWaiting]: oppositeTeam
        }

        draftUpdate(updateDraft)
            .then((response) => {
            })
            .catch(error => {
                console.log(error.response.data.response);
            })
    }

    return (
        <div>
            <h5>Select side for {yourTeam.name}</h5>
            <button
                className="btn btn-primary btn-lg"
                onClick={() => handleSideSelection("blue")}
            >
                Blue side
            </button>
            <> </>
            <button
                className="btn btn-danger btn-lg"
                onClick={() => handleSideSelection("red")}
            >
                Red side
            </button>
        </div>
    )
}

export default SideSelection