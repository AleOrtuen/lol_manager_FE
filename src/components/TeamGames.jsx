// import React from "react";
// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { gameRoomFindTeam } from "../service/gameRoomService";
// import Navbar from "./Navbar";

// function TeamGames() {

//     const location = useLocation();
//     const [roomGames, setRoomGames] = useState([]);
//     const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

//     useEffect(() => {
//         if (location.state && location.state.idTeam) {
//             gameRoomFindTeam(location.state.idTeam)
//                 .then((response) => {
//                     setRoomGames(response.data.objResponse);
//                 })
//                 .catch(error => {
//                     console.log(error.response.data.response);
//                 })
//         }
//     }, [location.state]);

//     const requestSort = (key) => {
//         setSortConfig((prev) => ({
//             key,
//             direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
//         }));
//     };

//     const resetSort = () => {
//         setSortConfig({ key: null, direction: 'asc' });
//     };

//     const sortedData = [...roomGames].sort((a, b) => {
//         if (!sortConfig.key) return 0;

//         let valA, valB;

//         if (sortConfig.key === "opponent") {
//             const getOpponentName = (game) => {
//                 const team1 = game?.team1;
//                 const team2 = game?.team2;
//                 if (team1 && team2 && location.state?.idTeam) {
//                     return team1.idTeam !== location.state.idTeam ? team1.name : team2.name;
//                 }
//                 return "Unknown";
//             };
//             valA = getOpponentName(a.game).toLowerCase();
//             valB = getOpponentName(b.game).toLowerCase();
//         } else if (sortConfig.key === "style") {
//             valA = a.game.style.toLowerCase();
//             valB = b.game.style.toLowerCase();
//         } else if (sortConfig.key === "fearless") {
//             valA = a.game.fearless;
//             valB = b.game.fearless;
//         } else if (sortConfig.key === "winner") {
//             valA = a.game?.winner?.idTeam === location.state?.idTeam ? 1 : 0;
//             valB = b.game?.winner?.idTeam === location.state?.idTeam ? 1 : 0;
//         } else {
//             valA = a[sortConfig.key] ?? 0;
//             valB = b[sortConfig.key] ?? 0;
//         }

//         if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
//         if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
//         return 0;
//     });

//     const renderSortIcon = (key) => {
//         if (sortConfig.key !== key) return "⇅";
//         return sortConfig.direction === 'asc' ? <i class="bi bi-sort-up"></i> : <i class="bi bi-sort-down-alt"></i>;
//     };

//     return (
//         <div className="container-fluid">
//             <Navbar />
//             <header className="bg-gray bg-gradient text-white">
//                 <h1 className="display-6">TEAM GAMES</h1>
//                 <br />
//                 <table className="table table-dark table-hover align-middle">
//                     <thead>
//                         <tr>
//                             <th>
//                                 Opponent
//                                 <span
//                                     onClick={() => requestSort('opponent')}
//                                     style={{ cursor: 'pointer', marginLeft: '8px' }}
//                                 >
//                                     {renderSortIcon('opponent')}
//                                 </span>
//                             </th>
//                             <th>
//                                 Style
//                                 <span
//                                     onClick={() => requestSort('style')}
//                                     style={{ cursor: 'pointer', marginLeft: '8px' }}
//                                 >
//                                     {renderSortIcon('style')}
//                                 </span>
//                             </th>
//                             <th>
//                                 Fearless
//                                 <span
//                                     onClick={() => requestSort('fearless')}
//                                     style={{ cursor: 'pointer', marginLeft: '8px' }}
//                                 >
//                                     {renderSortIcon('fearless')}
//                                 </span>
//                             </th>
//                             <th>
//                                 Date
//                                 <span
//                                     onClick={() => requestSort('date')}
//                                     style={{ cursor: 'pointer', marginLeft: '8px' }}
//                                 >
//                                     {renderSortIcon('date')}
//                                 </span>
//                             </th>
//                             <th>
//                                 Win
//                                 <span
//                                     onClick={() => requestSort('winner')}
//                                     style={{ cursor: 'pointer', marginLeft: '8px' }}
//                                 >
//                                     {renderSortIcon('winner')}
//                                 </span>
//                             </th>
//                             <th>Details</th>
//                             <th className="col-reset">
//                                 <i
//                                     className="bi bi-arrow-clockwise"
//                                     style={{ cursor: "pointer" }}
//                                     onClick={resetSort}
//                                 ></i>
//                             </th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {sortedData?.map((room, index) => {
//                             const team1 = room?.game?.team1;
//                             const team2 = room?.game?.team2;
//                             let opponentName = "Unknown";

//                             if (team1 && team2 && location.state?.idTeam) {
//                                 opponentName = team1.idTeam !== location.state.idTeam ? team1.name : team2.name;
//                             }

//                             return (
//                                 <React.Fragment key={index}>
//                                     <tr>
//                                         <td>{opponentName}</td>
//                                         <td>{room.game.style}</td>
//                                         <td>
//                                             {room.game.fearless ? (
//                                                 <i className="bi bi-check-circle-fill text-info"></i>
//                                             ) : (
//                                                 <i className="bi bi-x-circle-fill text-danger"></i>
//                                             )}
//                                         </td>
//                                         <td>
//                                             {new Date(room.game.date).toLocaleString("it-IT", {
//                                                 day: "2-digit",
//                                                 month: "2-digit",
//                                                 year: "numeric",
//                                                 hour: "2-digit",
//                                                 minute: "2-digit",
//                                             }).replace(",", " -")}
//                                         </td>
//                                         <td>
//                                             {room.game?.winner?.idTeam === location.state?.idTeam ? (
//                                                 <i className="bi bi-check-circle-fill text-info"></i>
//                                             ) : (
//                                                 <i className="bi bi-x-circle-fill text-danger"></i>
//                                             )}
//                                         </td>
//                                         <td>
//                                             <button
//                                                 className="btn btn-secondary"
//                                                 type="button"
//                                                 onClick={() => window.open(room.player1Link, "_blank")}
//                                             >
//                                                 Open
//                                             </button>
//                                         </td>
//                                         <td></td>
//                                     </tr>
//                                 </React.Fragment>
//                             );
//                         })}
//                     </tbody>

//                 </table>
//             </header>
//         </div>
//     );
// }

// export default TeamGames

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { gameRoomFindTeam } from "../service/gameRoomService";
import Navbar from "./Navbar";

function TeamGames() {
    const location = useLocation();
    const [roomGames, setRoomGames] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        if (location.state && location.state.idTeam) {
            gameRoomFindTeam(location.state.idTeam)
                .then((response) => {
                    setRoomGames(response.data.objResponse);
                })
                .catch(error => {
                    console.log(error.response.data.response);
                });
        }
    }, [location.state]);

    const requestSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
        setCurrentPage(1); 
    };

    const resetSort = () => {
        setSortConfig({ key: null, direction: 'asc' });
    };

    const sortedData = [...roomGames].sort((a, b) => {
        if (!sortConfig.key) return 0;
        let valA, valB;

        if (sortConfig.key === "opponent") {
            const getOpponentName = (game) => {
                const team1 = game?.team1;
                const team2 = game?.team2;
                if (team1 && team2 && location.state?.idTeam) {
                    return team1.idTeam !== location.state.idTeam ? team1.name : team2.name;
                }
                return "Unknown";
            };
            valA = getOpponentName(a.game).toLowerCase();
            valB = getOpponentName(b.game).toLowerCase();
        } else if (sortConfig.key === "style") {
            valA = a.game.style.toLowerCase();
            valB = b.game.style.toLowerCase();
        } else if (sortConfig.key === "fearless") {
            valA = a.game.fearless ? 1 : 0;
            valB = b.game.fearless ? 1 : 0;
        } else if (sortConfig.key === "winner") {
            valA = a.game?.winner?.idTeam === location.state?.idTeam ? 1 : 0;
            valB = b.game?.winner?.idTeam === location.state?.idTeam ? 1 : 0;
        } else {
            valA = a[sortConfig.key] ?? 0;
            valB = b[sortConfig.key] ?? 0;
        }

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    // PAGINAZIONE
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) return "⇅";
        return sortConfig.direction === 'asc' ? <i className="bi bi-sort-up"></i> : <i className="bi bi-sort-down-alt"></i>;
    };

    return (
        <div className="container-fluid">
            <Navbar />
            <header className="bg-gray bg-gradient text-white">
                <h1 className="display-6">TEAM GAMES</h1>
                <br />
                <table className="table table-dark table-hover align-middle">
                    <thead>
                        <tr>
                            <th>
                                Opponent
                                <span
                                    onClick={() => requestSort('opponent')}
                                    style={{ cursor: 'pointer', marginLeft: '8px' }}
                                >
                                    {renderSortIcon('opponent')}
                                </span>
                            </th>
                            <th>
                                Style
                                <span
                                    onClick={() => requestSort('style')}
                                    style={{ cursor: 'pointer', marginLeft: '8px' }}
                                >
                                    {renderSortIcon('style')}
                                </span>
                            </th>
                            <th>
                                Fearless
                                <span
                                    onClick={() => requestSort('fearless')}
                                    style={{ cursor: 'pointer', marginLeft: '8px' }}
                                >
                                    {renderSortIcon('fearless')}
                                </span>
                            </th>
                            <th>
                                Date
                                <span
                                    onClick={() => requestSort('date')}
                                    style={{ cursor: 'pointer', marginLeft: '8px' }}
                                >
                                    {renderSortIcon('date')}
                                </span>
                            </th>
                            <th>
                                Win
                                <span
                                    onClick={() => requestSort('winner')}
                                    style={{ cursor: 'pointer', marginLeft: '8px' }}
                                >
                                    {renderSortIcon('winner')}
                                </span>
                            </th>
                            <th>Details</th>
                            <th className="col-reset">
                                <i
                                    className="bi bi-arrow-clockwise"
                                    style={{ cursor: "pointer" }}
                                    onClick={resetSort}
                                ></i>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((room, index) => {
                            const team1 = room?.game?.team1;
                            const team2 = room?.game?.team2;
                            let opponentName = "Unknown";

                            if (team1 && team2 && location.state?.idTeam) {
                                opponentName = team1.idTeam !== location.state.idTeam ? team1.name : team2.name;
                            }

                            return (
                                <tr key={index}>
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
                                    <td></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* PAGINATION CONTROLS */}
                <div className="d-flex justify-content-center mt-3">
                    <button
                        className="btn btn-sm btn-secondary me-2"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                        Prev
                    </button>
                    <span className="align-self-center">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="btn btn-sm btn-secondary ms-2"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        Next
                    </button>
                </div>
            </header>
        </div>
    );
}

export default TeamGames;
