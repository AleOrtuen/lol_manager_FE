import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { gameRoomFindTeam } from "../service/gameRoomService";
import Navbar from "./Navbar";

function TeamGames() {

    const location = useLocation();
    const [roomGames, setRoomGames] = useState([]);

    useEffect(() => {
        if (location.state && location.state.idTeam) {
            gameRoomFindTeam(location.state.idTeam)
                .then((response) => {
                    setRoomGames(response.data.objResponse);
                })
                .catch(error => {
                    console.log(error.response.data.response);
                })
        }
    }, [location.state]);

    return (
        <div className="container-fluid">
            <Navbar />
            <header className="bg-gray bg-gradient text-white">
                <h1 className="display-6">TEAM GAMES</h1>
                <br />
                <table className="table table-dark table-hover align-middle">
                    <thead>
                        <tr>
                            <th>Opponent</th>
                            <th>Style</th>
                            <th>Fearless</th>
                            <th>Date</th>
                            <th>Win</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roomGames?.map((room, index) => {
                            const team1 = room?.game?.team1;
                            const team2 = room?.game?.team2;
                            let opponentName = "Unknown";

                            if (team1 && team2 && location.state?.idTeam) {
                                opponentName = team1.idTeam !== location.state.idTeam ? team1.name : team2.name;
                            }

                            return (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td>{opponentName}</td>
                                        <td>{room.game.style}</td>
                                        <td>
                                            {room.game.fearless ? (
                                                <i className="bi bi-check-circle-fill text-info"></i>
                                            ) : (
                                                <i className="bi bi-x-circle-fill text-danger"></i>
                                            )}
                                        </td>
                                        <td>
                                            {new Date(room.game.date).toLocaleString("it-IT", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }).replace(",", " -")}
                                        </td>
                                        <td>
                                            {room.game?.winner?.idTeam === location.state?.idTeam ? (
                                                <i className="bi bi-check-circle-fill text-info"></i>
                                            ) : (
                                                <i className="bi bi-x-circle-fill text-danger"></i>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-secondary"
                                                type="button"
                                                onClick={() => window.open(room.player1Link, "_blank")}
                                            >
                                                Open
                                            </button>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            );
                        })}
                    </tbody>

                </table>
            </header>
        </div>
    );
}

export default TeamGames