import { useParams } from "react-router-dom";
import DraftTest from "./DraftTest";

function GameRoom() {

    const { idRoom, role } = useParams();

    return (
        <div>
            <h1>Stanza di Draft</h1>
            <DraftTest idRoom={idRoom} role={role} />
        </div>
    )
}

export default GameRoom;