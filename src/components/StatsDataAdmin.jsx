import Navbar from "./Navbar.jsx";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {HOME} from "../utils/routes.js";
import {gameFolderFindAll} from "../service/gameFolderService.js";
import {champAnalysisFindFolder, draftsAnalysisFindFolder} from "../service/StatsAnalysisService.js";
import Champions from "./Champions.jsx";
import RateBar from "./RateBar.jsx";
import RateCircle from "./RateCircle.jsx";

function StatsDataAdmin() {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user);

    const [gameFolders, setGameFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState("");
    const [champsData, setChampsData] = useState([]);
    const [draftsData, setDraftsData] = useState();

    const [expandedRows, setExpandedRows] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    useEffect(() => {
        if (user?.admin === false) {
            navigate(HOME);
            return;
        }
        gameFolderFindAll()
            .then((response) => {
                setGameFolders(response.data.objResponse);
        })
            .catch(error => {
                console.log(error.response.data.response);
            })
    }, [user]);

    useEffect(() => {
        if (selectedFolder === "") return;
        setDraftsData();
        champAnalysisFindFolder(selectedFolder)
            .then((response) => {
                setChampsData(response.data.objResponse);
            })
            .catch(error => {
                console.log(error.response.data.response);
            })
        draftsAnalysisFindFolder(selectedFolder)
            .then((response) => {
                setDraftsData(response.data.objResponse)
            })
            .catch(error => {
                console.log(error.response.data.response);
            })

    }, [selectedFolder]);

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
                <h1 className="display-6">Competition Stats</h1>
                <br/>
                <div className="row justify-content-center mb-3">
                    <div className="col-6 col-xl-2 col-lg-4 col-md-4 col-sm-4">
                        <select
                            className="form-select form-select-sm "
                            id="folderSelection"
                            value={selectedFolder}
                            onChange={(e) => setSelectedFolder(e.target.value)}
                        >
                            <option value="">
                                Select game folder...
                            </option>

                            {gameFolders.map((folder) => (
                                <option key={folder.idGameFolder} value={folder.idGameFolder}>
                                    {folder.descr}
                                </option>
                            ))}

                        </select>
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <h5>Games played: {draftsData?.draftCount ?? "N/A"}</h5>
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    marginTop: "1.5rem",
                    flexWrap: "wrap",
                    gap: "1.5rem",
                }}>

                    {/* BLUE SIDE */}
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <p className="fw-bold mb-1" style={{color: "#0d6efd"}}>Blue Side</p>
                        <RateCircle
                            rate={draftsData?.winRateBlue}
                            count={draftsData?.winCountBlue}
                            size={90}
                        />
                    </div>

                    {/* RED SIDE */}
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <p className="fw-bold mb-1" style={{color: "#dc3545"}}>Red Side</p>
                        <RateCircle
                            rate={draftsData?.winRateRed}
                            count={draftsData?.winCountRed}
                            size={90}
                        />
                    </div>

                    {/* FP SIDE */}
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <p className="fw-bold mb-1" style={{color: "#facc15"}}>First pick</p>
                        <RateCircle
                            rate={draftsData?.winRateFP}
                            count={draftsData?.winCountFP}
                            size={90}
                        />
                    </div>

                    {/* LP SIDE */}
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <p className="fw-bold mb-1" style={{color: "#9ca3af"}}>Last pick</p>
                        <RateCircle
                            rate={draftsData?.winRateLP}
                            count={draftsData?.winCountLP}
                            size={90}
                        />
                    </div>
                </div>
                <table className="table table-dark table-hover align-middle mt-4">
                    <thead>
                    <tr>
                        <th className="col-champion text-start align-middle">
                            <div style={{paddingLeft: '30px'}}>
                                Champion
                                <span
                                    onClick={() => requestSort('name')}
                                    style={{cursor: 'pointer', marginLeft: '8px'}}
                                >
                                        {renderSortIcon('name')}
                                    </span>
                            </div>
                        </th>
                        <th className="col-stat">
                            Winrate% (n. games)
                            <span
                                onClick={() => requestSort('winRatePick')}
                                style={{cursor: 'pointer', marginLeft: '8px'}}
                            >
                                    {renderSortIcon('winRatePick')}
                                </span>
                        </th>
                        <th className="col-stat">
                            Pickrate% (n. games)
                            <span
                                onClick={() => requestSort('pickRate')}
                                style={{cursor: 'pointer', marginLeft: '8px'}}
                            >
                                    {renderSortIcon('pickRate')}
                                </span>
                        </th>
                        <th className="col-stat">
                            Banrate% (n. games)
                            <span
                                onClick={() => requestSort('banRate')}
                                style={{cursor: 'pointer', marginLeft: '8px'}}
                            >
                                    {renderSortIcon('banRate')}
                                </span>
                        </th>
                        <th className="col-reset">
                            <i
                                className="bi bi-arrow-clockwise"
                                style={{cursor: "pointer"}}
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
                                style={{cursor: 'pointer'}}
                            >
                                <td>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <Champions champions={[champ.champ]} size={"35px"}/>
                                        <span className="ms-2">{champ.champ.name}</span>
                                        <span className="ms-2">
                                                {expandedRows[startIndex + index] ? (
                                                    <i className="bi bi-caret-down-fill"/>
                                                ) : (
                                                    <i className="bi bi-caret-right-fill"/>
                                                )}
                                            </span>
                                    </div>
                                </td>
                                <td>{champ.winRatePick !== null ?
                                    <RateBar rate={champ.winRatePick} count={champ.winCountPick}/> :
                                    <RateBar rate={0}/>}</td>
                                <td>{champ.pickRate !== null ?
                                    <RateBar rate={champ.pickRate} count={champ.pickCount}/> :
                                    <RateBar rate={0}/>}</td>
                                <td>{champ.banRate !== null ?
                                    <RateBar rate={champ.banRate} count={champ.banCount}/> :
                                    <RateBar rate={0}/>}</td>
                                <td></td>
                            </tr>
                            {expandedRows[startIndex + index] && (
                                <tr>
                                    <td style={{backgroundColor: '#2a2a2a'}}><strong>Side:</strong></td>
                                    <td style={{backgroundColor: '#2a2a2a'}}>
                                            <span className="text-primary">
                                                Blue: {champ.winRatePickBlue !== null ? Math.floor(champ.winRatePickBlue * 100) / 100 : "0"}% ({champ.winCountPickBlue})
                                            </span><br/>
                                        <span className="text-danger">
                                                Red: {champ.winRatePickRed !== null ? Math.floor(champ.winRatePickRed * 100) / 100 : "0"}% ({champ.winCountPickRed})
                                            </span>
                                    </td>
                                    <td style={{backgroundColor: '#2a2a2a'}}>
                                            <span className="text-primary">
                                                Blue: {champ.pickRateBlue !== null ? Math.floor(champ.pickRateBlue * 100) / 100 : "0"}% ({champ.pickCountBlue})
                                            </span><br/>
                                        <span className="text-danger">
                                                Red: {champ.pickRateRed !== null ? Math.floor(champ.pickRateRed * 100) / 100 : "0"}% ({champ.pickCountRed})
                                            </span>
                                    </td>
                                    <td style={{backgroundColor: '#2a2a2a'}}>
                                            <span className="text-primary">
                                                Blue: {champ.banRateBlue !== null ? Math.floor(champ.banRateBlue * 100) / 100 : "0"}% ({champ.banCountBlue})
                                            </span><br/>
                                        <span className="text-danger">
                                                Red: {champ.banRateRed !== null ? Math.floor(champ.banRateRed * 100) / 100 : "0"}% ({champ.banCountRed})
                                            </span>
                                    </td>
                                    <td style={{backgroundColor: '#2a2a2a'}}></td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>

                {/* PAGINATION CONTROLS */}
                <div className="d-flex justify-content-center mt-3">
                    <button
                        className="btn btn-purple btn-sm me-2"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                        Prev
                    </button>
                    <span className="align-self-center">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="btn btn-purple btn-sm ms-2"
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

export default StatsDataAdmin