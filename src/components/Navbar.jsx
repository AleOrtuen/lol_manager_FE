import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LOGIN, HOME, ACCOUNT, POOL, CREATE_GAME } from "../utils/routes";
import { setTeam } from "../store/slice/teamSlice";
import miniLogo from '../img/mini.png';
import drafterIcon from '../img/draft_icon.png';
import teamIcon from '../img/team_icon.png';
import topIco from '../img/roles/top_ico.png';
import jngIco from '../img/roles/jng_ico.png';
import midIco from '../img/roles/mid_ico.png';
import adcIco from '../img/roles/adc_ico.png';
import supIco from '../img/roles/sup_ico.png';
import fillIco from '../img/roles/fill_ico.png';
import { resetAllSlices } from "../store/slice/resetAllSlice";
import { userFindTeams } from "../service/userService";
import { teamFindAll } from "../service/teamService";
import TeamsSidebar from "./TeamsSideBar";


function Navbar() {
    const [showTeamsSidebar, setShowTeamsSidebar] = useState(false);

    const user = useSelector((state) => state.user);
    const teams = useSelector((state) => state.team);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user || Object.keys(user).length === 0) {
            navigate(LOGIN);
            return;
        }
        if (user && user.idUser && user.admin === false) {
            userFindTeams(user.idUser).then((response) => {
                if (response.data && response.data.objResponse) {
                    dispatch(setTeam(response.data.objResponse));
                } else {
                    console.error(error.response.data.response);
                }
            })
                .catch(error => {
                    console.log(error.response.data.response);
                });
        } else if (user && user.admin === true) {
            teamFindAll()
                .then((response) => {
                    dispatch(setTeam(response.data.objResponse));
                })
                .catch(error => {
                    console.log(error.response.data.response);
                })
        }
    }, []);

    const roleImages = {
        top: topIco,
        jng: jngIco,
        mid: midIco,
        adc: adcIco,
        sup: supIco,
        fill: fillIco
    };

    const roleImage = roleImages[user?.pRole] ?? roleImages.fill;


    const logOut = () => {
        dispatch(resetAllSlices());
        navigate(LOGIN);
    }

    return (
        <>
            {user && user != null ? (
                <>
                    {/* NAVBAR */}
                    <nav
                        className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top"
                        id="mainNav"
                        style={{ paddingLeft: '45px', paddingRight: '45px' }}
                    >
                        <div className="container-fluid px-0">
                            <a className="navbar-brand" onClick={() => navigate(HOME)} style={{ cursor: 'pointer' }}>
                                <img src={miniLogo} className="glow-hover" style={{ width: '23%', height: '23%', display: 'block' }} />
                            </a>
                            <button
                                className="navbar-toggler"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarResponsive"
                                aria-controls="navbarResponsive"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            <div className="collapse navbar-collapse" id="navbarResponsive">
                                <ul className="navbar-nav ms-auto">
                                    {/* Drafter */}
                                    <li className="nav-item">
                                        <a
                                            className="nav-link ms-auto glow-hover"
                                            href={CREATE_GAME}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src={drafterIcon}
                                                style={{ maxWidth: '20px' }}
                                                alt="DRAFTER"
                                            />
                                            <span> Drafter</span>
                                        </a>
                                    </li>

                                    {/* Teams - Apre la sidebar */}
                                    <li className="nav-item">
                                        <a
                                            className="nav-link"
                                            onClick={() => setShowTeamsSidebar(true)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <img
                                                src={teamIcon}
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    marginRight: '5px'
                                                }}
                                                alt="Team icon"
                                            />
                                            Teams
                                        </a>
                                    </li>

                                    {/* User Dropdown */}
                                    <li className="nav-item dropdown">
                                        <a
                                            className="nav-link dropdown-toggle"
                                            id="navbarDropdownMenuLink"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            {roleImage && (
                                                <img
                                                    src={roleImage}
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        maxWidth: '20px',
                                                        maxHeight: '20px',
                                                        marginRight: '5px'
                                                    }}
                                                    alt="Role icon"
                                                />
                                            )}
                                            {user.username}
                                        </a>
                                        <ul className="dropdown-menu bg-dark" aria-labelledby="navbarDropdownMenuLink">
                                            <li>
                                                <a className="dropdown-item text-light" onClick={() => navigate(ACCOUNT)}>My account</a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item text-light" onClick={() => navigate(POOL)}>Champion pool</a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item text-danger" onClick={() => logOut()}>Logout</a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>

                    {/* Teams Sidebar Component */}
                    <TeamsSidebar
                        isOpen={showTeamsSidebar}
                        onClose={() => setShowTeamsSidebar(false)}
                    />
                </>
            ) : (
                <h3>Utente non loggato</h3>
            )}
        </>
    )
}

export default Navbar;