import { useEffect, useState } from "react";
import { champFindAll } from "../../service/championsService";
import Champions from "../Champions";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { gameRoomFindId } from "../../service/gameRoomService";
import Timer from "../Timer";
import { useWebSocketDraft } from "../web_socket/useWebSocketGame";
import GuestSelection from "./GuestSelection";
import SideSelection from "./SideSelection";
import Picks from "./Picks";
import Bans from "./Bans";
import { draftFindRoom } from "../../service/draftService";
import ReadyCheck from "./ReadyCheck";


function Draft() {
    const teams = useSelector((state) => state.team);
    const { idRoom, role } = useParams();
    const [champions, setChampions] = useState([]);
    const [game, setGame] = useState();
    const [draft, setDraft] = useState();
    const [pageLoading, setPageLoading] = useState(false);

    //LISTA RUOLI E IMG
    const rolesData = [
        { role: 'top' },
        { role: 'jng' },
        { role: 'mid' },
        { role: 'adc' },
        { role: 'sup' }
    ];

    const [blueBans, setBlueBans] = useState({
        ban1: {
            champ: null,
            locked: false
        },
        ban2: {
            champ: null,
            locked: false
        },
        ban3: {
            champ: null,
            locked: false
        },
        ban4: {
            champ: null,
            locked: false
        },
        ban5: {
            champ: null,
            locked: false
        }
    });
    const [redBans, setRedBans] = useState({
        ban1: {
            champ: null,
            locked: false
        },
        ban2: {
            champ: null,
            locked: false
        },
        ban3: {
            champ: null,
            locked: false
        },
        ban4: {
            champ: null,
            locked: false
        },
        ban5: {
            champ: null,
            locked: false
        }
    });

    const [draftEvents, setDraftEvents] = useState({
        blueBan1: false,
        redBan1: false,
        blueBan2: false,
        redBan2: false,
        blueBan3: false,
        redBan3: false,
        bluePick1: false,
        redPick1: false,
        redPick2: false,
        bluePick2: false,
        bluePick3: false,
        redPick3: false,
        redBan4: false,
        blueBan4: false,
        redBan5: false,
        blueBan5: false,
        redPick4: false,
        bluePick4: false,
        bluePick5: false,
        redPick5: false
    })

    //WEBSOCKET GAME E DRAFT UPDATE
    const { sendMessage } = useWebSocketDraft(idRoom, (msg) => {
        if (msg.type === "GAME_UPDATE" && msg.game) {
            console.log("🆕 GAME_UPDATE received", msg.game);
            setGame(msg.game);
        }

        if (msg.type === "DRAFT_UPDATE" && msg.draft) {
            console.log("🆕 DRAFT_UPDATE received", msg.draft);
            setDraft(msg.draft);
        }
    });

    //TROVA TUTTI I CAMPIONI, IL GAME E LA DRAFT.
    useEffect(() => {
        champFindAll()
            .then((response) => {
                setChampions(response.data.objResponse);
            })
            .catch(error => {
                console.log(error.response.data.response);
            })

        gameRoomFindId(idRoom)
            .then((response) => {
                setGame(response.data.objResponse.game);
            })
            .catch(error => {
                console.log(error.response.data.response);
            })

        draftFindRoom(idRoom)
            .then((response) => {
                setDraft(response.data.objResponse);
            })
            .catch(error => {
                console.log(error.response.data.response);
            })
    }, []);

    useEffect(() => {
        if (!game) return;

        if (role === 'player1' && game.team1 !== null) {
            setPageLoading(true);
        }

        if (role === 'player2' && game.team2 !== null) {
            setPageLoading(true);
        }

    }, [game, role]);

    return (

        <div>
            {pageLoading && pageLoading === true ?
                <div>
                    {/* TEAMS E PHASE */}
                    <div className="row justify-content-center">
                        {/* TEAM BLUE SIDE */}
                        <div className="col-4">
                            {draft && draft.teamBlue !== null ?
                                <h1 className="text-primary display-6">{draft.teamBlue.name}</h1>
                                :
                                <h1 className="text-primary display-6">BLUE</h1>
                            }
                        </div>
                        {/* TIMER AND SERIES */}
                        <div className="col-4">
                            {/* <Timer /> */}
                        </div>
                        {/* TEAM RED SIDE */}
                        <div className="col-4">
                            {draft && draft.teamRed !== null ?
                                <h1 className="text-danger display-6">{draft.teamRed.name}</h1>
                                :
                                <h1 className="text-danger display-6">RED</h1>
                            }
                        </div>
                    </div>

                    {/* PICKS E ALL CHAMPS */}
                    <div className="row">
                        {/* PICKS BLUE SIDE */}
                        <div className="col-2">
                            <Picks />
                        </div>
                        {/* CHAMPIONS AND SIDE SELECTION */}
                        <div className="col-8"
                            style={{
                                maxHeight: '60vh'
                            }}
                        >

                            {draft && draft.teamBlue != null && draft.teamRed != null ?
                                <div
                                    className="rounded-top d-flex flex-column h-100"
                                    style={{
                                        border: '5px solid #242424',
                                    }}
                                >
                                    <div className="bg-dark text-white text-center p-2">
                                        Champions
                                    </div>
                                    <div className="flex-grow-1 overflow-auto p-2 text-center"
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '3px',
                                            justifyContent: 'center',
                                            alignContent: 'flex-start'
                                        }}
                                    >
                                        {champions && champions.length > 0 ? (
                                            <Champions champions={champions} />
                                        ) : null}
                                    </div>
                                </div>
                                :
                                (game && game.team1 != null && game.team2 != null ?
                                    <SideSelection game={game} />
                                    : <h5>Waiting for other team to join the game</h5>
                                )
                            }
                        </div>
                        {/* PICKS RED SIDE */}
                        <div className="col-2">
                            <Picks />
                        </div>
                    </div>

                    {/* BANS E BUTTON */}
                    <div className="row align-items-center">
                        {/* BLUE BANS */}
                        <div className="col-5 d-flex justify-content-center align-items-center" style={{ display: 'flex', gap: '10px' }}>
                            <Bans />
                        </div>

                        <div className="col-2">
                            {draft && draft.ready === false ?
                                <ReadyCheck draft={draft} setDraft={setDraft} />
                                :
                                null
                            }

                        </div>

                        {/* RED BANS */}
                        <div className="col-5 d-flex justify-content-center align-items-center" style={{ display: 'flex', gap: '10px' }}>
                            <Bans />
                        </div>
                    </div>
                </div>
                :
                <GuestSelection game={game} />
            }
        </div>
    );
};

export default Draft;
