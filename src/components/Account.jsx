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

            {user && Object.keys(user).length > 0 ?
                <div>
                    <Navbar />
                    <header className="bg-gray bg-gradient">
                        <br />
                        <h1>
                            {roleImage && (
                                <img
                                    src={roleImage}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        maxWidth: '50px',
                                        maxHeight: '50px',
                                        marginRight: '5px',
                                        marginBottom: '6px'
                                    }}
                                    alt="Role icon"
                                />
                            )}
                            {user.username}
                        </h1>
                        {teams && teams.length > 0 ?
                            (teams.map((team) =>
                                <div key={team.idTeam}>
                                    <span>{team.name}</span>
                                    <br />
                                </div>
                            ))
                            : null
                        }

                        <br />

                        <button className="btn btn-purple btn-sm  dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Edit Profile
                        </button>
                        <ul className="dropdown-menu bg-dark">
                            <li>
                                <a
                                    className="dropdown-item text-light"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modal"
                                    onClick={() => setDataToUpdate({ field: 'username', value: user.username })}
                                >
                                    <b>Username:</b> {user.username}
                                </a>
                            </li>
                            <li>
                                <a
                                    className="dropdown-item text-light"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modal"
                                    onClick={() => setDataToUpdate({ field: 'email', value: user.email })}
                                >
                                    <b>Email:</b> {user.email}
                                </a>
                            </li>
                            <li>
                                <a
                                    className="dropdown-item text-light"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modal"
                                    onClick={() => setDataToUpdate({ field: 'ruolo', value: user.pRole })}
                                >
                                    <b>Role:</b> {user.pRole}
                                </a>
                            </li>
                            <li>
                                <a
                                    className="dropdown-item text-light"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modal"
                                    onClick={() => setDataToUpdate({ field: 'password', value: user.password })}
                                >
                                    <b>Password</b>
                                </a>
                            </li>
                        </ul>
                        <ModaleUserData toUpdate={dataToUpdate} />
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
                                            <Champions champions={user.champions} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                </div>
                : <h3>Utente non loggato</h3>
            }
        </>



    )
}

export default Account