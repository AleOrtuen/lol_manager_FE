import { useCallback, useEffect, useRef, useState } from "react";
import { champFindAll } from "../../service/championsService";
import Champions from "../Champions";
import { useParams } from "react-router-dom";
import { gameRoomFindId } from "../../service/gameRoomService";
import { useWebSocketDraft } from "../web_socket/useWebSocketGame";
import GuestSelection from "./GuestSelection";
import SideSelection from "./SideSelection";
import Picks from "./Picks";
import Bans from "./Bans";
import { draftFindRoom } from "../../service/draftService";
import ReadyCheck from "./ReadyCheck";
import Timer from "./Timer";


function Draft() {
    const { idRoom, role } = useParams();
    const [champions, setChampions] = useState([]);
    const [game, setGame] = useState();
    const [draft, setDraft] = useState();
    const [selectedChampion, setSelectedChampion] = useState(null);
    const [remoteSelectedChampion, setRemoteSelectedChampion] = useState(null);
    const [currentPhase, setCurrentPhase] = useState();
    const [pageLoading, setPageLoading] = useState(false);
    const [passiveState, setPassiveState] = useState();
    const [yourSide, setYourSide] = useState();
    const yourSideRef = useRef();

    const [blueBans, setBlueBans] = useState(
        Array(5).fill({ champ: null, locked: false })
    );
    const [redBans, setRedBans] = useState(
        Array(5).fill({ champ: null, locked: false })
    );
    const [bluePicks, setBluePicks] = useState(
        Array(5).fill({ champ: null, locked: false })
    );
    const [redPicks, setRedPicks] = useState(
        Array(5).fill({ champ: null, locked: false })
    );

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

    //WEBSOCKET EVENTS
    const onWebSocketMessage = useCallback((msg) => {
        if (msg.type === "GAME_UPDATE" && msg.game) {
            console.log("🆕 GAME_UPDATE received", msg.game);
            setGame(msg.game);
        }

        if (msg.type === "DRAFT_UPDATE" && msg.draft) {
            console.log("🆕 DRAFT_UPDATE received", msg.draft);
            setDraft(msg.draft);
        }

        if (msg.type === "EVENT_CHANGE" && msg.events) {
            const nextPhase = msg.events.currentPhase;
            console.log("🆕 EVENTS_UPDATE received", msg.events);
            const side = yourSideRef.current;
            setCurrentPhase(nextPhase);

            setPassiveState(
                (side === 'blue' && nextPhase.startsWith("blue")) ||
                    (side === 'red' && nextPhase.startsWith("red")) ? false : true
            );
        }

        if (msg.type === "CURRENT_EVENT" && msg.events) {
            const current = msg.events.currentPhase;
            console.log("🆕 CURRENT_EVENT received", current);
            setCurrentPhase(current);

            const side = yourSideRef.current;
            if (!side) {
                console.warn("⚠️ yourSideRef ancora non inizializzato, salto setPassiveState");
                return;
            }

            setPassiveState(
                (side === 'blue' && current.startsWith("blue")) ||
                    (side === 'red' && current.startsWith("red")) ? false : true
            );
        }

        if (msg.type === "SELECTED_CHAMP" && msg.champion && role !== msg.sender) {
            console.log("🆕 SELECTED_CHAMP received", msg.champion);
            setRemoteSelectedChampion(msg.champion);
        }
    }, [setGame, setDraft, setCurrentPhase, setPassiveState, setRemoteSelectedChampion]);

    const { sendMessage, connected } = useWebSocketDraft(idRoom, onWebSocketMessage);

    //FIND ALL CHAMPS, GAME AND DRAFT
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

    // VERIFY IF THE GAME EXIST BEFORE LOAD THE PAGE
    useEffect(() => {
        if (!game) return;

        if (role === 'player1' && game.team1 !== null) {
            setPageLoading(true);
        }

        if (role === 'player2' && game.team2 !== null) {
            setPageLoading(true);
        }

    }, [game, role]);

    // CHECK WHAT SIDE THE TEAM IS PLAYING
    useEffect(() => {
        if (!draft || !game) return;
        const yourTeam = role === "player1" ? game.team1 : game.team2;
        const side = yourTeam?.idTeam === draft?.teamBlue?.idTeam ? "blue" : "red";
        yourSideRef.current = side;
        setYourSide(side);
    }, [draft, role]);

    // FIRST EVENT START AFTER READY CHECK
    useEffect(() => {
        if (draft?.ready && role === "player1") {
            sendMessage({
                idRoom,
                type: "EVENT",
                sender: role
            });
        }
    }, [draft?.ready]);

    // RETRIEVE CURRENT EVENT ON UPDATE
    useEffect(() => {
        sendMessage({
            idRoom,
            type: "CURRENT_EVENT_REQUEST",
            sender: role
        });
    }, [connected]);

    // SEND INFO ABOUT PRESELECTED PICK
    useEffect(() => {
        if (!passiveState && selectedChampion) {
            sendMessage({
                idRoom,
                type: "PICK",
                sender: role,
                champion: selectedChampion
            });
        }
    }, [selectedChampion, passiveState]);

    const lockChampion = () => {
        if (!passiveState) {
            sendMessage({
                idRoom,
                type: "LOCK",
                sender: role,
                events: {
                    currentPhase: currentPhase
                }
            });
        }
    }

    const consoleLogs = () => {
        console.log(passiveState);
        console.log(currentPhase);
        console.log(yourSide);
        console.log(draft);
    };

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
                            {draft && draft.ready ?
                                <Timer currentPhase={currentPhase} />
                                : null
                            }
                            <button onClick={consoleLogs}>LOGS</button>
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
                                            <Champions champions={champions} onSelectChampion={(champ) => setSelectedChampion(champ)} />
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
                            <Bans
                                selectedChampion={
                                    currentPhase?.startsWith("blueBan")
                                        ? (passiveState ? remoteSelectedChampion : selectedChampion)
                                        : undefined
                                }
                                lockedChampions={blueBans}
                                currentPhase={currentPhase}
                            />
                        </div>

                        <div className="col-2">
                            {draft && draft.ready === false ?
                                <ReadyCheck draft={draft} setDraft={setDraft} />
                                :
                                <button 
                                    className="btn btn-secondary btn-lg" 
                                    disabled={passiveState}
                                    onClick={lockChampion}
                                >
                                    Lock
                                </button>
                            }
                        </div>

                        {/* RED BANS */}
                        <div className="col-5 d-flex justify-content-center align-items-center" style={{ display: 'flex', gap: '10px' }}>
                            <Bans
                                selectedChampion={
                                    currentPhase?.startsWith("redBan")
                                        ? (passiveState ? remoteSelectedChampion : selectedChampion)
                                        : undefined
                                }
                                lockedChampions={redBans}
                                currentPhase={currentPhase}
                            />
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
