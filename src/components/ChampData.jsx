import { useEffect, useState } from "react";
import { teamAnalysisChampAnalysis, teamAnalysisFindTeam } from "../service/teamAnalysisService";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";
import Champions from "./Champions";
import React from "react";
import RateBar from "./RateBar";

function ChampData() {
    const location = useLocation();
    const [champsData, setChampsData] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        if (location.state && location.state.idTeam) {
            teamAnalysisChampAnalysis(location.state.idTeam)
                .then((response) => {
                    setChampsData(response.data.objResponse);
                })
                .catch(error => {
                    console.log(error.response.data.response);
                });
        }
    }, [location.state]);

    const toggleRow = (id) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const requestSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
        setCurrentPage(1);
    };

    const resetSort = () => {
        setSortConfig({ key: null, direction: 'asc' });
        setCurrentPage(1);
    };

    const sortedData = [...champsData].sort((a, b) => {
        if (!sortConfig.key) return 0;

        let valA, valB;
        if (sortConfig.key === "name") {
            valA = a.champ.name.toLowerCase();
            valB = b.champ.name.toLowerCase();
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
        <div>
            <Navbar />
            <header className="bg-gray bg-gradient text-white">
                <h1 className="display-6">Champion Stats</h1>
                <br />
                <table className="table table-dark table-hover align-middle">
                    <thead>
                        <tr>
                            <th className="col-champion text-start align-middle" >
                                <div style={{ paddingLeft: '30px' }}>
                                    Champion
                                    <span
                                        onClick={() => requestSort('name')}
                                        style={{ cursor: 'pointer', marginLeft: '8px' }}
                                    >
                                        {renderSortIcon('name')}
                                    </span>
                                </div>
                            </th>
                            <th className="col-stat">
                                Winrate% (n. games)
                                <span
                                    onClick={() => requestSort('winRatePick')}
                                    style={{ cursor: 'pointer', marginLeft: '8px' }}
                                >
                                    {renderSortIcon('winRatePick')}
                                </span>
                            </th>
                            <th className="col-stat">
                                Pickrate% (n. games)
                                <span
                                    onClick={() => requestSort('pickRate')}
                                    style={{ cursor: 'pointer', marginLeft: '8px' }}
                                >
                                    {renderSortIcon('pickRate')}
                                </span>
                            </th>
                            <th className="col-stat">
                                Banrate% (n. games)
                                <span
                                    onClick={() => requestSort('banRate')}
                                    style={{ cursor: 'pointer', marginLeft: '8px' }}
                                >
                                    {renderSortIcon('banRate')}
                                </span>
                            </th>
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
                        {currentData.map((champ, index) => (
                            <React.Fragment key={startIndex + index}>
                                <tr
                                    onClick={() => toggleRow(startIndex + index)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Champions champions={[champ.champ]} size={"35px"} />
                                            <span className="ms-2">{champ.champ.name}</span>
                                            <span className="ms-2">
                                                {expandedRows[startIndex + index] ? (
                                                    <i className="bi bi-caret-down-fill" />
                                                ) : (
                                                    <i className="bi bi-caret-right-fill" />
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                      <td>{champ.winRatePick !== null ? <RateBar rate={champ.winRatePick} count={champ.winCountPick}/> : <RateBar rate={0}/>}</td>
                                      <td>{champ.pickRate !== null ? <RateBar rate={champ.pickRate} count={champ.pickCount}/> : <RateBar rate={0} />}</td>
                                      <td>{champ.banRate !== null ? <RateBar rate={champ.banRate} count={champ.banCount}/> : <RateBar rate={0} />}</td>
                                    <td></td>
                                </tr>
                                {expandedRows[startIndex + index] && (
                                    <tr>
                                        <td style={{ backgroundColor: '#2a2a2a' }}><strong>Side:</strong></td>
                                        <td style={{ backgroundColor: '#2a2a2a' }}>
                                            <span className="text-primary">
                                                Blue: {champ.winRatePickBlue !== null ? Math.floor(champ.winRatePickBlue * 100) / 100 : "0"}% ({champ.winCountPickBlue})
                                            </span><br />
                                            <span className="text-danger">
                                                Red: {champ.winRatePickRed !== null ? Math.floor(champ.winRatePickRed * 100) / 100 : "0"}% ({champ.winCountPickRed})
                                            </span>
                                        </td>
                                        <td style={{ backgroundColor: '#2a2a2a' }}>
                                            <span className="text-primary">
                                                Blue: {champ.pickRateBlue !== null ? Math.floor(champ.pickRateBlue * 100) / 100 : "0"}% ({champ.pickCountBlue})
                                            </span><br />
                                            <span className="text-danger">
                                                Red: {champ.pickRateRed !== null ? Math.floor(champ.pickRateRed * 100) / 100 : "0"}% ({champ.pickCountRed})
                                            </span>
                                        </td>
                                        <td style={{ backgroundColor: '#2a2a2a' }}>
                                            <span className="text-primary">
                                                Blue: {champ.banRateBlue !== null ? Math.floor(champ.banRateBlue * 100) / 100 : "0"}% ({champ.banCountBlue})
                                            </span><br />
                                            <span className="text-danger">
                                                Red: {champ.banRateRed !== null ? Math.floor(champ.banRateRed * 100) / 100 : "0"}% ({champ.banCountRed})
                                            </span>
                                        </td>
                                        <td style={{ backgroundColor: '#2a2a2a' }}></td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
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


export default ChampData;
