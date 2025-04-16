import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { teamFindChamps, teamFindMembers } from "../service/teamService";
import Champions from "./Champions";
import topIco from '../img/roles/top_ico.png';
import jngIco from '../img/roles/jng_ico.png';
import midIco from '../img/roles/mid_ico.png';
import adcIco from '../img/roles/adc_ico.png';
import supIco from '../img/roles/sup_ico.png';
import ModaleTeamData from "./ModaleTeamData";

function Team() {

    const teams = useSelector((state) => state.team);
    const [champs, setChamps] = useState();
    const [members, setMembers] = useState();
    const location = useLocation();
    const [dataToUpdate, setDataToUpdate] = useState(null);

    //LISTA RUOLI E IMG
    const rolesData = [
        { role: 'top', image: topIco },
        { role: 'jng', image: jngIco },
        { role: 'mid', image: midIco },
        { role: 'adc', image: adcIco },
        { role: 'sup', image: supIco }
    ];

    useEffect(() => {
        if (location.state && location.state.idTeam) {
            setChamps(null);
            teamFindChamps(location.state.idTeam).then((response) => {
                setChamps(response.data.objResponse);
            }).catch(error => {
                console.log('Error fetching champions:', error.response?.data?.response || error.message);
            });

            teamFindMembers(location.state.idTeam)
                .then((response) => {
                    console.log('Members data:', response.data.objResponse);  // Log dei membri
                    setMembers(response.data.objResponse);
                })
                .catch(error => {
                    console.log('Error fetching members:', error.response?.data?.response || error.message);
                });
        }
    }, [location.state]);

    return (
        <div>
            <Navbar />
            <header className="bg-gray bg-gradient text-white">
                {teams.map((team) => (
                    team.idTeam === location.state.idTeam ? (
                        <>
                            <h1 className="display-6">{team.name}</h1>
                            <p>{team.tag}</p>
                            <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Modifica team
                            </button>
                            <ul className="dropdown-menu bg-dark">
                                <li>
                                    <a
                                        className="dropdown-item text-light"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modal"
                                        onClick={() => setDataToUpdate({ field: 'nome', value: team.name })}
                                    >
                                        <b>Nome:</b> {team.name}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item text-light"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modal"
                                        onClick={() => setDataToUpdate({ field: 'tag', value: team.tag })}
                                    >
                                        <b>Tag:</b> {team.tag}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item text-light"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modal"
                                        onClick={() => setDataToUpdate({ field: 'membri', value: members })}
                                    >
                                        <b>Membri</b>
                                    </a>
                                </li>
                            </ul>
                            <ModaleTeamData toUpdate={dataToUpdate} team={team} />
                        </>


                    ) : null
                ))}
                <br />
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-12">
                            <div className="d-flex flex-wrap justify-content-center">
                                {rolesData.slice(0, 3).map((role) => (
                                    <div key={role.role} className="role-item col-auto mx-4 mb-3">
                                        <div className="d-flex align-items-center">
                                            <div className="role-icon">
                                                <img
                                                    src={role.image}
                                                    className="me-2"
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        maxWidth: '20px',
                                                        maxHeight: '20px',
                                                    }}
                                                    alt="Role icon"
                                                />
                                            </div>
                                            <div className="role-name">
                                                {members && members.length > 0 ? (
                                                    members.map((member) => (
                                                        member.pRole === role.role ? (
                                                            <span key={member.id}>{member.username}</span>
                                                        ) : null
                                                    ))
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Forzare gli ultimi due ruoli ad andare a capo quando lo spazio è limitato */}
                                <div className="w-100 d-md-none"></div>

                                {rolesData.slice(3).map((role) => (
                                    <div key={role.role} className="role-item col-auto mx-4 mb-3">
                                        <div className="d-flex align-items-center">
                                            <div className="role-icon">
                                                <img
                                                    src={role.image}
                                                    className="me-2"
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        maxWidth: '20px',
                                                        maxHeight: '20px',
                                                    }}
                                                    alt="Role icon"
                                                />
                                            </div>
                                            <div className="role-name">
                                                {members && members.length > 0 ? (
                                                    members.map((member) => (
                                                        member.pRole === role.role ? (
                                                            <span key={member.id}>{member.username}</span>
                                                        ) : null
                                                    ))
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div
                            className="col p-1"
                            style={{
                                // height: '50vh',
                                marginLeft: '10%',
                                marginRight: '10%'
                            }}
                        >
                            <div
                                className="rounded-top d-flex flex-column h-100"
                                style={{
                                    border: '5px solid #242424',
                                }}
                            >
                                <div className="bg-dark text-white text-center p-2">
                                    Champion pool
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
                                    {champs && champs.length > 0 ? (
                                        <Champions champions={champs} />
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );

}

export default Team;