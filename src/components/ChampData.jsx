import { useEffect, useState } from "react";
import { teamAnalysisChampAnalysis, teamAnalysisFindTeam } from "../service/teamAnalysisService";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";
import Champions from "./Champions";
import React from "react";

function ChampData() {
    const location = useLocation();
    const [champsData, setChampsData] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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
    };

    const resetSort = () => {
        setSortConfig({ key: null, direction: 'asc' });
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

    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) return "⇅";
        return sortConfig.direction === 'asc' ? <i class="bi bi-sort-up"></i> : <i class="bi bi-sort-down-alt"></i>;
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
                        {sortedData.map((champ, index) => (
                            <React.Fragment key={index}>
                                <tr
                                    onClick={() => toggleRow(index)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Champions
                                                champions={[champ.champ]}
                                                size={"35px"}
                                            />
                                            <span className="ms-2">{champ.champ.name}</span>
                                            <span className="ms-2">
                                                {expandedRows[index] ? (
                                                    <i className="bi bi-caret-down-fill" />
                                                ) : (
                                                    <i className="bi bi-caret-right-fill" />
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        {champ.winRatePick !== null
                                            ? Math.floor(champ.winRatePick * 100) / 100
                                            : "0"}% ({champ.winCountPick})
                                    </td>
                                    <td>
                                        {champ.pickRate !== null
                                            ? Math.floor(champ.pickRate * 100) / 100
                                            : "0"}% ({champ.pickCount})
                                    </td>
                                    <td>
                                        {champ.banRate !== null
                                            ? Math.floor(champ.banRate * 100) / 100
                                            : "0"}% ({champ.banCount})
                                    </td>
                                    <td>

                                    </td>
                                </tr>
                                {expandedRows[index] && (
                                    <tr>
                                        <td style={{ backgroundColor: '#2a2a2a' }}>
                                            <strong>Side:</strong>
                                        </td>
                                        <td style={{ backgroundColor: '#2a2a2a' }}>
                                            <div>
                                                <span className="text-primary">
                                                    Blue: {champ.winRatePickBlue !== null
                                                        ? Math.floor(champ.winRatePickBlue * 100) / 100
                                                        : "0"}% ({champ.winCountPickBlue})
                                                </span>
                                                <br />
                                                <span className="text-danger">
                                                    Red: {champ.winRatePickRed !== null
                                                        ? Math.floor(champ.winRatePickRed * 100) / 100
                                                        : "0"}% ({champ.winCountPickRed})
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ backgroundColor: '#2a2a2a' }}>
                                            <div>
                                                <span className="text-primary">
                                                    Blue: {champ.pickRateBlue !== null
                                                        ? Math.floor(champ.pickRateBlue * 100) / 100
                                                        : "0"}% ({champ.pickCountBlue})
                                                </span>
                                                <br />
                                                <span className="text-danger">
                                                    Red: {champ.pickRateRed !== null
                                                        ? Math.floor(champ.pickRateRed * 100) / 100
                                                        : "0"}% ({champ.pickCountRed})
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ backgroundColor: '#2a2a2a' }}>
                                            <div>
                                                <span className="text-primary">
                                                    Blue: {champ.banRateBlue !== null
                                                        ? Math.floor(champ.banRateBlue * 100) / 100
                                                        : "0"}% ({champ.banCountBlue})
                                                </span>
                                                <br />
                                                <span className="text-danger">
                                                    Red: {champ.banRateRed !== null
                                                        ? Math.floor(champ.banRateRed * 100) / 100
                                                        : "0"}% ({champ.banCountRed})
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ backgroundColor: '#2a2a2a' }}>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </header>
        </div>
    );
}

export default ChampData;
