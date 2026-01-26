import { useParams } from "react-router-dom"
import { useWebSocketDraft } from "../web_socket/useWebSocketGame";
import {useCallback, useEffect, useState} from "react";

function ReadyCheck({ draft, setDraft }) {

    const { idRoom, role } = useParams();
    const [checked, setChecked] = useState(false);
    const [opponendReady, setOpponentReady] = useState(false);

    //WEBSOCKET GAME E DRAFT UPDATE
    const onWebSocketMessage = useCallback((msg) => {

        if (msg.type === msg.sender + " READY" && msg.type) {
            if (msg.sender === role) {
                setChecked(true);
            } else {
                setOpponentReady(true);
            }
            console.log(msg.type);
        }

        if (msg.type === "READY_BOTH" && msg.type) {
            console.log(msg.type);
            setDraft(msg.draft);
        }

        if (msg.type === "REMOVE_READY" && msg.type) {
            setChecked(false);
            setOpponentReady(false);
        }

    }, [setChecked, setDraft]);


    const { sendMessage, connected } = useWebSocketDraft(idRoom, onWebSocketMessage);

    useEffect(() => {
        sendMessage({
            idRoom,
            type: "READY_CHECK_STATUS",
            sender: role,
            draft: draft
        })
    }, [connected, draft]);

    const handleReadyCheck = () => {
        sendMessage({
            idRoom,
            type: "READY_CHECK",
            sender: role,
            draft: draft
        });
    }

    return (
        <div>

            {!checked && (
                <button
                    className="btn btn-lg btn-danger"
                    onClick={handleReadyCheck}
                >
                    Ready
                </button>
            )}

            <br />
            {opponendReady && (
                <div>Opponent is ready</div>
            )}
            {checked && (
                <h5>Waiting opponent...</h5>
            )}
        </div>
    );

}

export default ReadyCheck