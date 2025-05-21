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

    //TROVA TUTTI I CAMPIONI E IL GAME.
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

    return (

        <div>
            {pageLoading && pageLoading === true ?
                <div>
                    {/* TEAMS E PHASE */}
                    <div className="row justify-content-center">
                        <div className="col-4">
                            {draft && draft.teamBlue !== null ?
                                <h4>{draft.teamBlue.name}</h4>
                                :
                                <h4>BLUE</h4>
                            }
                        </div>
                        <div className="col-4">
                            ciao ciao
                        </div>
                        <div className="col-4">
                            {draft && draft.teamRed !== null ?
                                <h4>{draft.teamRed.name}</h4>
                                :
                                <h4>RED</h4>
                            }
                        </div>
                    </div>

                    {/* PICKS E ALL CHAMPS */}
                    <div className="row">
                        <div className="col-2">
                            {rolesData.map((role) =>
                                <div className="row justify-content-center">
                                    <div
                                        style={{
                                            width: '85px',
                                            height: '85px',
                                            border: '2px solid #555',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: '#333',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            marginBottom: '10px'
                                        }}

                                    >
                                        <img
                                            src="/img/champions/champless.png"
                                            alt="No Champion"
                                            style={{
                                                width: '67px',
                                                height: '67px',
                                                objectFit: 'cover',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
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
                                            <Champions champions={champions}/>
                                        ) : null}
                                    </div>
                                </div>
                                :
                                (game && game.team1 != null && game.team2 != null ?
                                        <SideSelection game={game}/>
                                        : <h5>Waiting for other team to join the game</h5>
                                )
                            }
                        </div>
                        <div className="col-2">
                            {rolesData.map((role) =>
                                <div className="row justify-content-center">
                                    <div
                                        style={{
                                            width: '85px',
                                            height: '85px',
                                            border: '2px solid #555',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: '#333',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            marginBottom: '10px'
                                        }}

                                    >
                                        <img
                                            src="/img/champions/champless.png"
                                            alt="No Champion"
                                            style={{
                                                width: '67px',
                                                height: '67px',
                                                objectFit: 'cover',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* BANS E BUTTON */}
                    <div className="row align-items-center">
                        <div className="col-5 d-flex justify-content-center align-items-center" style={{ display: 'flex', gap: '10px' }}>
                            {rolesData.map((role) =>
                                <div
                                    key={role.role}
                                    style={{
                                        width: '85px',
                                        height: '85px',
                                        border: '2px solid #555',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#333',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        marginBottom: '10px'
                                    }}
                                >
                                    <img
                                        src="/img/champions/champless.png"
                                        alt="No Champion"
                                        style={{
                                            width: '67px',
                                            height: '67px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="col-2">
                            BUTTON
                        </div>

                        <div className="col-5 d-flex justify-content-center align-items-center" style={{ display: 'flex', gap: '10px' }}>
                            {rolesData.map((role) =>
                                <div
                                    key={role.role}
                                    style={{
                                        width: '85px',
                                        height: '85px',
                                        border: '2px solid #555',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#333',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        marginBottom: '10px'
                                    }}
                                >
                                    <img
                                        src="/img/champions/champless.png"
                                        alt="No Champion"
                                        style={{
                                            width: '67px',
                                            height: '67px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </div>
                            )}
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
