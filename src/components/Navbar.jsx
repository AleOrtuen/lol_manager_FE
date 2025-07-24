import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LOGIN, TEAM, HOME, COMP_BUILDER, TEAM_COMP, ACCOUNT, POOL, TEAM_FORM, TEAMS, CHAMP_DATA, CREATE_GAME, TEAM_GAMES } from "../utils/routes";
import { resetTeam, setTeam } from "../store/slice/teamSlice";
import miniLogo from '../img/mini.png';
import drafterIcon from '../img/draft_icon.png';
import teamIcon from '../img/team_icon.png';
import topIco from '../img/roles/top_ico.png';
import jngIco from '../img/roles/jng_ico.png';
import midIco from '../img/roles/mid_ico.png';
import adcIco from '../img/roles/adc_ico.png';
import supIco from '../img/roles/sup_ico.png';
import { useEffect } from "react";
import { resetAllSlices } from "../store/slice/resetAllSlice";
import { userFindTeams } from "../service/userService";
import { teamFindAll } from "../service/teamService";
import { resetUser } from "../store/slice/userSlice";

function Navbar() {

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
    };

    const roleImage = user && user.pRole ? roleImages[user.pRole] : null;

    const logOut = () => {
        dispatch(resetAllSlices());
        navigate(LOGIN);
    }

    return (
        <>
            {/* SE USER E' PRESENT */}
            {user && user != null ?

                // NAVBAR             
                <nav
                    className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav"
                    style={{ paddingLeft: '45px', paddingRight: '45px' }}
                >
                    <div className="container-fluid px-0">
                        <a className="navbar-brand" onClick={() => navigate(HOME)}>
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
                                <li className="nav-item dropdown">
                                    <a
                                        className="nav-link  ms-auto glow-hover"
                                        href={CREATE_GAME}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={drafterIcon}

                                            style={{ maxWidth: '20px' }}
                                            alt="DRAFTER"
                                        />
                                        <span>  Drafter</span>
                                    </a>

                                </li>
                                {/* {teams && teams.length > 0 ?
                                    (teams.map((team) =>
                                        (teams.length === 1 ?
                                        <li className="nav-item dropdown" key={team.idTeam}>
                                            <a
                                                className="nav-link dropdown-toggle"
                                                id="navbarDropdownMenuLink"
                                                role="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                <img
                                                    src={teamIcon}
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        maxWidth: '20px',
                                                        maxHeight: '20px',
                                                        marginRight: '5px'
                                                    }}
                                                    alt="Team icon"
                                                />
                                                {team.tag}
                                            </a>
                                            <ul className="dropdown-menu bg-dark" aria-labelledby="navbarDropdownMenuLink">
                                                <li>
                                                    <a className="dropdown-item text-light" onClick={() => navigate(TEAM, { state: { idTeam: team.idTeam } })}>Profilo</a>
                                                </li>
                                                <li>
                                                    <a className="dropdown-item text-light" onClick={() => navigate(TEAM_COMP, { state: { idTeam: team.idTeam } })}>Team Comp</a>
                                                </li>
                                                <li>
                                                    <a className="dropdown-item text-light" onClick={() => navigate(COMP_BUILDER, { state: { idTeam: team.idTeam } })}>Comp builder</a>
                                                </li>
                                                <li>
                                                    <a className="dropdown-item text-light" onClick={() => navigate(CHAMP_DATA, { state: { idTeam: team.idTeam } })}>Champion Stats</a>
                                                </li>
                                            </ul>
                                        </li>
                                        : null
                                        )
                                    ))
                                    : null
                                } */}
                                {teams && teams.length > 0 && (
                                    <li className="nav-item dropdown">
                                        <a
                                            className="nav-link dropdown-toggle"
                                            id="navbarDropdownMenuLink"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <img
                                                src={teamIcon}
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    maxWidth: '20px',
                                                    maxHeight: '20px',
                                                    marginRight: '5px'
                                                }}
                                                alt="Team icon"
                                            />
                                            {teams.length === 1 ? teams[0].tag : "Teams"}
                                        </a>

                                        <ul className="dropdown-menu bg-dark" aria-labelledby="navbarDropdownMenuLink">
                                            {teams.length === 1 ? (
                                                <>
                                                    <li>
                                                        <a className="dropdown-item text-light" onClick={() => navigate(TEAM, { state: { idTeam: teams[0].idTeam } })}>Profilo</a>
                                                    </li>
                                                    <li>
                                                        <a className="dropdown-item text-light" onClick={() => navigate(TEAM_COMP, { state: { idTeam: teams[0].idTeam } })}>Team Comp</a>
                                                    </li>
                                                    <li>
                                                        <a className="dropdown-item text-light" onClick={() => navigate(COMP_BUILDER, { state: { idTeam: teams[0].idTeam } })}>Comp builder</a>
                                                    </li>
                                                    <li>
                                                        <a className="dropdown-item text-light" onClick={() => navigate(TEAM_GAMES, { state: { idTeam: teams[0].idTeam } })}>Games</a>
                                                    </li>
                                                    <li>
                                                        <a className="dropdown-item text-light" onClick={() => navigate(CHAMP_DATA, { state: { idTeam: teams[0].idTeam } })}>Champion Stats</a>
                                                    </li>
                                                </>
                                            ) : (
                                                teams.map((team) => (
                                                    <li className="dropdown-submenu" key={team.idTeam}>
                                                        <a
                                                            className="dropdown-item dropdown-toggle text-light"
                                                            href="#"
                                                            role="button"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                            {team.tag}
                                                        </a>
                                                        <ul className="dropdown-menu bg-dark">
                                                            <li>
                                                                <a className="dropdown-item text-light" onClick={() => navigate(TEAM, { state: { idTeam: team.idTeam } })}>Profilo</a>
                                                            </li>
                                                            <li>
                                                                <a className="dropdown-item text-light" onClick={() => navigate(TEAM_COMP, { state: { idTeam: team.idTeam } })}>Team Comp</a>
                                                            </li>
                                                            <li>
                                                                <a className="dropdown-item text-light" onClick={() => navigate(COMP_BUILDER, { state: { idTeam: team.idTeam } })}>Comp builder</a>
                                                            </li>
                                                            <li>
                                                                <a className="dropdown-item text-light" onClick={() => navigate(CHAMP_DATA, { state: { idTeam: team.idTeam } })}>Champion Stats</a>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    </li>
                                )}


                                {user.admin ?
                                    <li className="nav-item dropdown">
                                        <a
                                            className="nav-link dropdown-toggle"
                                            id="navbarDropdownMenuLink"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Gestione teams
                                        </a>
                                        <ul className="dropdown-menu bg-dark" aria-labelledby="navbarDropdownMenuLink">
                                            <li>
                                                <a className="dropdown-item text-light" onClick={() => navigate(TEAMS)}>Teams</a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item text-light" onClick={() => navigate(TEAM_FORM)}>Crea team</a>
                                            </li>
                                        </ul>
                                    </li>
                                    : null
                                }

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
                                            <a className="dropdown-item text-light" onClick={() => navigate(ACCOUNT)}>Il mio account</a>
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
                // SE USER NON PRESENTE        
                : <h3>Utente non loggato</h3>
            }
        </>
    )
}

export default Navbar