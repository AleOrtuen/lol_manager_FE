import { useParams } from "react-router-dom";
import { useWebSocketDraft } from "../web_socket/useWebSocketGame";
import { useEffect } from "react";

function SideSelection({ team }) {

    const { idRoom, role } = useParams();

    const { sendMessage } = useWebSocketDraft(idRoom, (msg) => {
        if (msg.type === "SIDE_SELECTION") {
            console.log("🆕 SIDE_SELECTION received", msg.side);
        }
    });

    // useEffect(() => {

    // }, [idRoom, sendMessage]);

    const handleSideSelection = (side) => {
        sendMessage({
            idRoom,
            type: "SIDE_SELECTION",
            sender: role,
            side: side
        })
    }

    return (
        <div>
            <h6>Select side for {team.name}</h6>
            <button
                className="btn btn-primary btn-md"
                onClick={() => handleSideSelection("blue")}
            >
                Blue side
            </button>
            <> </>
            <button
                className="btn btn-danger btn-md"
                onClick={() => handleSideSelection("red")}
            >
                Red side
            </button>
        </div>
    )
}

export default SideSelection