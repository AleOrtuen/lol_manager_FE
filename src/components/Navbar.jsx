import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LOGIN, TEAM, HOME, COMP_BUILDER, TEAM_COMP, ACCOUNT, POOL } from "../utils/routes";
import { setTeam } from "../store/slice/teamSlice";
import miniLogo from '../img/mini_logo.png';
import topIco from '../img/roles/top_ico.png';
import jngIco from '../img/roles/jng_ico.png';
import midIco from '../img/roles/mid_ico.png';
import adcIco from '../img/roles/adc_ico.png';
import supIco from '../img/roles/sup_ico.png';
import { useEffect } from "react";
import { resetAllSlices } from "../store/slice/resetAllSlice";
import { userFindTeams } from "../service/userService";

function Navbar() {

    const user = useSelector((state) => state.user);
    const teams = useSelector((state) => state.team);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (user && user.idUser) {
            userFindTeams(user.idUser).then((response) => {
                    console.log(response.data); 
                    if (response.data && response.data.objResponse) {
                        dispatch(setTeam(response.data.objResponse));
                    } else {
                        console.error(error.response.data.response);
                    }
                })
                .catch((error) => {
                    console.log(error.response.data.response);
                });
        }
    }, [user]);
    
    // Oggetto che mappa i ruoli alle immagini
    const roleImages = {
        top: topIco,
        jng: jngIco,
        mid: midIco,
        adc: adcIco,
        sup: supIco,
    };

    // Ottieni l'immagine del ruolo in base a user.pRole
    const roleImage = user && user.pRole ? roleImages[user.pRole] : null;    
    
    const logOut = () => {
        dispatch(resetAllSlices());
        navigate(LOGIN);
    } 

    return(
        <>
        {/* SE USER E' PRESENT */}
            { user ? 
            
        // NAVBAR             
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
                <div class="container px-4">
                    <a class="navbar-brand" onClick={() => navigate(HOME)}>
                        <img src={miniLogo} style={{width: '8%', height: '8%', display: 'block' }}/>
                    </a>
                <button 
                    class="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarResponsive" 
                    aria-controls="navbarResponsive" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>
                
                <div class="collapse navbar-collapse" id="navbarResponsive">
                    <ul class="navbar-nav ms-auto ">
                    {teams && teams.length > 0 ?
                    ( teams.map( (team) =>
                    
                    <li class="nav-item dropdown" key={team.idTeam}>
                            <a 
                                class="nav-link dropdown-toggle" 
                                id="navbarDropdownMenuLink" 
                                role="button" 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                            >
                                {team.tag}
                            </a>
                            <ul class="dropdown-menu bg-dark" aria-labelledby="navbarDropdownMenuLink">
                                <li>
                                    <a class="dropdown-item text-light" onClick={() => navigate(TEAM, {state: {idTeam: team.idTeam}})}>Profilo</a>
                                </li>
                                <li>
                                    <a class="dropdown-item text-light" onClick={() => navigate(TEAM_COMP, {state: {idTeam: team.idTeam}})}>Team Comp</a>
                                </li>  
                                <li>
                                    <a class="dropdown-item text-light" onClick={() => navigate(COMP_BUILDER, {state: {idTeam: team.idTeam}})}>Comp builder</a>
                                </li>                                 
                            </ul>   
                        </li>
                    ))
                    : null
                    }
                    <li class="nav-item dropdown">
                            <a 
                                class="nav-link dropdown-toggle" 
                                id="navbarDropdownMenuLink" 
                                role="button" 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                            >
                                Gestione teams
                            </a>
                            <ul class="dropdown-menu bg-dark" aria-labelledby="navbarDropdownMenuLink">
                                <li>
                                    <a class="dropdown-item text-light" onClick={() => navigate()}>I tuoi team</a>
                                </li>
                                <li>
                                    <a class="dropdown-item text-light" onClick={() => navigate()}>Crea team</a>
                                </li>                                 
                            </ul>   
                        </li>


                        <li class="nav-item dropdown">
                            <a 
                                class="nav-link dropdown-toggle"
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
                            <ul class="dropdown-menu bg-dark" aria-labelledby="navbarDropdownMenuLink">
                                <li>
                                    <a class="dropdown-item text-light" onClick={() => navigate(ACCOUNT)}>Il mio account</a>
                                </li>
                                <li>
                                    <a class="dropdown-item text-light" onClick={() => navigate(POOL)}>Champion pool</a>
                                </li>
                                <li>
                                    <a class="dropdown-item text-danger" onClick={() => logOut()}>Logout</a>
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