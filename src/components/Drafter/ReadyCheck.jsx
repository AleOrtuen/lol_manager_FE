import { useParams } from "react-router-dom"
import { useWebSocketDraft } from "../web_socket/useWebSocketGame";
import { useState } from "react";

function ReadyCheck({ draft, setDraft }) {

    const { idRoom, role } = useParams();
    const [checked, setChecked] = useState(false);

    //WEBSOCKET GAME E DRAFT UPDATE
    const { sendMessage } = useWebSocketDraft(idRoom, (msg) => {
        if (msg.type === msg.sender + " READY" && msg.type) {
            if (msg.sender === role) {
                setChecked(true);
            }
            console.log(msg.type);
        }

        if (msg.type === "READY_BOTH" && msg.type) {
            console.log(msg.type);
            setDraft(msg.draft);
        }
    });

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
            <button
                className={`btn btn-lg ${checked ? "btn-success" : "btn-danger"}`}
                onClick={handleReadyCheck}
            >
                {checked ? "Ready" : "Ready"}
            </button>
            <br/>
            {checked ? "Waiting opponent.." : null}
        </div>
    )
}

export default ReadyCheck