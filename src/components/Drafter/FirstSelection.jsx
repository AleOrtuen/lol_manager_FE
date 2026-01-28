import { useParams } from "react-router-dom";
import { draftUpdate } from "../../service/draftService.js";

function FirstSelection({ game, draft }) {
    const { role } = useParams();

    const yourTeam = role === "player1" ? game.team1 : game.team2;
    const opponentTeam = role === "player1" ? game.team2 : game.team1;

    /* -------------------- DERIVED STATE -------------------- */

    const isSideSelection =
        draft?.teamBlue === null || draft?.teamRed === null;

    const isPickSelection =
        draft?.firstPick === null || draft?.lastPick === null;

    const isYourSelection =
        draft?.selectionTeam?.idTeam === yourTeam?.idTeam;

    const hasSelectionStarted =
        draft?.firstSelection !== null;

    const getSelectionLabel = () => {
        if (!draft?.firstSelection || !draft.selectionTeam) return "";

        const selectorIsYou =
            draft.selectionTeam.idTeam === yourTeam.idTeam;

        // PICK SELECTION
        if (draft.firstSelection === "pick") {
            if (!draft.firstPick || !draft.lastPick) return "";

            const selectorIsFirstPick =
                draft.firstPick.idTeam === draft.selectionTeam.idTeam;

            const label = selectorIsFirstPick ? "first pick" : "last pick";

            return selectorIsYou
                ? label                  // You selected first/last pick
                : label;                 // Opponent selected first/last pick
        }

        // SIDE SELECTION
        if (draft.firstSelection === "side") {
            if (!draft.teamBlue || !draft.teamRed) return "";

            const selectorIsBlue =
                draft.teamBlue.idTeam === draft.selectionTeam.idTeam;

            const label = selectorIsBlue ? "blue side" : "red side";

            return selectorIsYou
                ? label
                : label;
        }

        return "";
    };



    const selectionLabel = getSelectionLabel();

    /* -------------------- HANDLERS -------------------- */

    const confirmAction = (message, onConfirm) => {
        if (window.confirm(message)) {
            onConfirm();
        }
    };

    const handleSideChoice = (side) => {
        confirmAction(`Confirm ${side} side?`, () => {
            const isBlue = side === "blue";

            const updateDraft = {
                ...draft,
                teamBlue: isBlue ? yourTeam : opponentTeam,
                teamRed: isBlue ? opponentTeam : yourTeam,
                selectionTeam: draft.selectionTeam ?? yourTeam,
                firstSelection: draft.firstSelection ?? "side"
            };

            draftUpdate(updateDraft).catch(err =>
                console.error(err.response?.data?.response)
            );
        });
    };

    const handlePickChoice = (pick) => {
        confirmAction(`Confirm ${pick} pick?`, () => {
            const isFirst = pick === "first";

            const updateDraft = {
                ...draft,
                firstPick: isFirst ? yourTeam : opponentTeam,
                lastPick: isFirst ? opponentTeam : yourTeam,
                selectionTeam: draft.selectionTeam ?? yourTeam,
                firstSelection: draft.firstSelection ?? "pick"
            };

            draftUpdate(updateDraft).catch(err =>
                console.error(err.response?.data?.response)
            );
        });
    };


    return (
        <div className="lol-draft-card">
            <div className="lol-header">
                <span className="lol-title">Draft Setup</span>
                <span className="lol-team">{yourTeam.name}</span>
            </div>

            {!isYourSelection ? (
                <>
                    {hasSelectionStarted && (
                        <div className="lol-section-title">
                            Opponent selected {selectionLabel}
                        </div>
                    )}

                    {/* SIDE SELECTION */}
                    {isSideSelection && (
                        <div className="lol-section">
                            <div className="lol-section-title">Choose Side</div>
                            <div className="lol-button-row">
                                <button
                                    className="lol-btn blue"
                                    onClick={() => handleSideChoice("blue")}
                                >
                                    Blue Side
                                </button>
                                <button
                                    className="lol-btn red"
                                    onClick={() => handleSideChoice("red")}
                                >
                                    Red Side
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="lol-divider" />

                    {/* PICK ORDER */}
                    {isPickSelection && (
                        <div className="lol-section">
                            <div className="lol-section-title">Pick Order</div>
                            <div className="lol-button-row">
                                <button
                                    className="lol-btn gold"
                                    onClick={() => handlePickChoice("first")}
                                >
                                    First Pick
                                </button>
                                <button
                                    className="lol-btn silver"
                                    onClick={() => handlePickChoice("last")}
                                >
                                    Last Pick
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="lol-section-title">
                        You selected {selectionLabel}
                    </div>
                    <div className="lol-section-title">
                        Waiting for opponent...
                    </div>
                </>
            )}
        </div>
    );
}

export default FirstSelection;
