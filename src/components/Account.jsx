import { useState } from "react";
import { useSelector } from "react-redux"
import Navbar from "./Navbar";
import Champions from "./Champions";
import ModaleUserData from "./ModaleUserData";
import topIco from '../img/roles/top.webp';
import jngIco from '../img/roles/jng.webp';
import midIco from '../img/roles/mid.webp';
import adcIco from '../img/roles/adc.webp';
import supIco from '../img/roles/sup.webp';
import fillIco from '../img/roles/fill.webp';
import coachIco from '../img/roles/coach.png';
import teamIcon from '../img/team_icon.png';

function Account() {

    const user = useSelector((state) => state.user);
    const teams = useSelector((state) => state.team);
    const [dataToUpdate, setDataToUpdate] = useState(null);

    const roleImages = {
        top: topIco,
        jng: jngIco,
        mid: midIco,
        adc: adcIco,
        sup: supIco,
        fill: fillIco,
        coach: coachIco
    };

    const roleImage = user && user.pRole ? roleImages[user.pRole] : null;

    return (
        <>

            {user && Object.keys(user).length > 0 ? (
                <div>
                    <Navbar />
                    <header className="bg-gray bg-gradient">
                        <br/>
                        <div className="container">
                            {/* BOX INFO */}
                            <div className="p-4 d-flex flex-wrap align-items-start justify-content-center" style={{
                                backgroundColor: "rgba(0,0,0,0.3)",
                                borderRadius: "8px",
                                boxShadow: "0 0 8px rgba(255,255,255,0.1)",
                                maxWidth: "600px",
                                margin: "0 auto",
                                gap: "2rem",
                            }}>
                                {/* COLONNA SINISTRA: LOGO + MODIFICA */}
                                <div className="d-flex flex-column align-items-center mb-3 mb-md-0">

                                    {roleImage && (
                                        <img
                                            src={roleImage}
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                maxWidth: '50px',
                                                maxHeight: '50px',
                                                objectFit: "cover",
                                            }}
                                            alt="Role icon"
                                        />
                                    )}

                                    {/* ACCORDION COACH */}
                                    <div
                                        className="accordion mt-3"
                                        id="accordionCoach"
                                        style={{
                                            width: "100%",
                                            maxWidth: "150px", // 👈 stessa larghezza del logo
                                            alignSelf: "center",
                                        }}
                                    >
                                        <div className="accordion-item border-0 bg-transparent">
                                            <h2 className="accordion-header" id="headingCoach">
                                                <button
                                                    className="accordion-button collapsed bg-transparent text-white shadow-none"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapseCoach"
                                                    aria-expanded="false"
                                                    aria-controls="collapseCoach"
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: "8px",
                                                        backgroundColor: "transparent",
                                                        boxShadow: "none",
                                                        padding: "6px 8px",
                                                        paddingRight: "24px", // spazio per la freccia
                                                        paddingLeft: "24px", // 👈 stesso spazio a sinistra per bilanciare
                                                        textAlign: "center",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        position: "relative",
                                                    }}
                                                >
                                                    <img
                                                        src={teamIcon}
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            flexShrink: 0,
                                                        }}
                                                        alt="Team icon"
                                                    />
                                                    <strong style={{fontSize: "0.9rem"}}>Teams</strong>
                                                </button>
                                            </h2>
                                            <div
                                                id="collapseCoach"
                                                className="accordion-collapse collapse bg-transparent"
                                                aria-labelledby="headingCoach"
                                                data-bs-parent="#accordionCoach"
                                            >
                                                <div
                                                    className="accordion-body text-center text-white bg-transparent"
                                                    style={{
                                                        borderTop: "1px solid rgba(255,255,255,0.1)",
                                                        maxWidth: "100%",
                                                        overflow: "hidden",
                                                        padding: "8px",
                                                    }}
                                                >
                                                    {teams && teams.length > 0 ?
                                                        (teams.map((team) =>
                                                            <div
                                                                key={team.idTeam}
                                                                className="py-1"
                                                                style={{
                                                                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                                                                    whiteSpace: "nowrap",
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    fontSize: "0.85rem",
                                                                }}
                                                            >
                                                                {team.name}
                                                            </div>
                                                        )) : (
                                                            <div className="text-muted text-truncate"
                                                                 style={{fontSize: "0.85rem"}}>
                                                                No teams available
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="btn btn-purple btn-sm mt-2 dropdown-toggle"
                                            type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Edit Profile
                                    </button>
                                    <ul className="dropdown-menu bg-dark">
                                        <li>
                                            <a
                                                className="dropdown-item text-light"
                                                data-bs-toggle="modal"
                                                data-bs-target="#modal"
                                                onClick={() => setDataToUpdate({
                                                    field: 'username',
                                                    value: user.username
                                                })}
                                            >
                                                <b>Username:</b> {user.username}
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item text-light"
                                                data-bs-toggle="modal"
                                                data-bs-target="#modal"
                                                onClick={() => setDataToUpdate({field: 'email', value: user.email})}
                                            >
                                                <b>Email:</b> {user.email}
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item text-light"
                                                data-bs-toggle="modal"
                                                data-bs-target="#modal"
                                                onClick={() => setDataToUpdate({field: 'ruolo', value: user.pRole})}
                                            >
                                                <b>Role:</b> {user.pRole}
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item text-light"
                                                data-bs-toggle="modal"
                                                data-bs-target="#modal"
                                                onClick={() => setDataToUpdate({
                                                    field: 'password',
                                                    value: user.password
                                                })}
                                            >
                                                <b>Password</b>
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                {/* COLONNA DESTRA: NAME + TAG + WINRATE */}
                                <div className="flex-grow-1 text-center text-md-start">
                                    <h1 className="display-6 mb-4">{user.username}</h1>
                                    <p className="mb-2"><strong>Email: </strong>{user.email}</p>
                                    <p className="mb-2"><strong>Role: </strong>{user.pRole}</p>
                                </div>

                            </div>

                            <ModaleUserData toUpdate={dataToUpdate}/>
                            <br/>
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
                                                <Champions champions={user.champions}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                </div>
            ) : (<h3>Utente non loggato</h3>)
            }
        </>
    );
}

export default Account