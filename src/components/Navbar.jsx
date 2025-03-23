import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../utils/routes";
import { resetUser } from "../store/slice/userSlice";
import miniLogo from '../img/mini_logo.png';

import midIco from '../img/roles/mid_ico.png';

function Navbar() {

    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logOut = () => {
        dispatch(resetUser())
        navigate(LOGIN)
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
                        <li class="nav-item dropdown">
                            <a 
                                class="nav-link dropdown-toggle" 
                                id="navbarDropdownMenuLink" 
                                role="button" 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                            >
                                Gestione team
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
                                <img 
                                    src={midIco} 
                                    style={{
                                        width: '20%', 
                                        height: '20%', 
                                        maxWidth: '20px', 
                                        maxHeight: '20px', 
                                        marginRight: '5px'}}
                                />    
                                {user.username}
                            </a>
                            <ul class="dropdown-menu bg-dark" aria-labelledby="navbarDropdownMenuLink">
                                <li>
                                    <a class="dropdown-item text-light" onClick={() => navigate()}>Il mio account</a>
                                </li>
                                <li>
                                    <a class="dropdown-item text-light" onClick={() => navigate()}>Champion pool</a>
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