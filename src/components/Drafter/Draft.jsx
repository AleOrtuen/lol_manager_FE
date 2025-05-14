import { useEffect, useState } from "react";
import { champFindAll } from "../../service/championsService";
import Champions from "../Champions";
import { useParams } from "react-router-dom";
import DraftTest from "../DraftTest";
import { useSelector } from "react-redux";
import GuestSelection from "../GuestSelection";
import { gameRoomFindId } from "../../service/gameRoomService";


function Draft() {
    const teams = useSelector((state) => state.team);
    const [champions, setChampions] = useState([]);
    const { idRoom, role } = useParams();
    const [game, setGame] = useState();
    const [pageLoading, setPageLoading] = useState(false);
    //LISTA RUOLI E IMG
    const rolesData = [
        { role: 'top' },
        { role: 'jng' },
        { role: 'mid' },
        { role: 'adc' },
        { role: 'sup' }
    ];

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

    return (

        <div>
            {pageLoading && pageLoading === true ?
                <div>
                    {/* TEAMS E PHASE */}
                    <div className="row justify-content-center">
                        <div className="col-4">
                            {game && game.team1 !== null && game.team1.name !== null ?
                                <h4>{game.team1.name}</h4>
                                :
                                <h4>TEAM 1</h4>
                            }
                        </div>
                        <div className="col-4">
                            <DraftTest idRoom={idRoom} role={role} />
                        </div>
                        <div className="col-4">
                            {game && game.team2 !== null && game.team2.name !== null ?
                                <h4>{game.team2.name}</h4>
                                :
                                <h4>TEAM 2</h4>
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
