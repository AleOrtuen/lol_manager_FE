import Logo from "./Logo"
import { useNavigate } from "react-router-dom";
import { HOME, SIGNUP } from "../utils/routes";
import { userAuth } from "../service/userService";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/slice/userSlice";
import { resetTeam } from "../store/slice/teamSlice";
import { resetGame } from "../store/slice/gameSlice";
import { useEffect, useState } from "react";

function Login() {

    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (!user || Object.keys(user).length !== 0) {
            navigate(HOME);
            return; 
        }
    }, []);

    function login() {
        if (email && email !== ''
            && password && password !== ''
        ) {

            userAuth(email, password).then((response) => {
                dispatch(setUser(response.data.objResponse))
                dispatch(resetTeam());
                navigate(HOME)
            }).catch(error => {
                console.log(error.response.data.response)
                alert('Credenziali errate')
            })
        } else {
            alert('Inserire email e password')
        }
    }

    // LOGIN ALLA PRESSIONE DI INVIO
    function handleKey(e) {
        if (e.key === "Enter") {
            login();
        }
    }

    return (
        <>
            <Logo />
            <div>
                <br/>
                <div className="row justify-content-center">
                    <div className="col-10 col-lg-5 col-md-6 col-sm-8">
                        <b>Benvenuto nella versione alpha di LoL Team Manager!<br/></b>
                        Potrai facilmente gestire la tua lista di campioni giocabili, creare team e progettare le tue strategie.<br/>
                        Lo strumento Comp builder ti aiuterà nel drafting così da ottenere il miglior risultato possibile nel combinare i campioni del tuo team!
                    </div>
                </div>
                <br/>
                <h5 className="fw-bolder">Login</h5>               
                <div className="row justify-content-center">
                    <div className="col-8 col-lg-4 col-md-6 col-sm-6">
                        <form>
                            <div className="form-floating mb-2">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="email"
                                    value={email}
                                    placeholder="Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={handleKey}
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="form-floating mb-2">
                                <input
                                    className="form-control"
                                    type="password"
                                    id="password"
                                    value={password}
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={handleKey}
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                        </form>
                        <br />
                        <button className="btn btn-outline-secondary btn-lg" onClick={() => login()}>
                            Entra
                        </button>
                    </div>
                </div>
            </div>
            <br />
            {/* <p> */}
            Non hai un account?
            <a className="a-custom" onClick={() => navigate(SIGNUP)}> Registrati!</a>

            {/* </p> */}
        </>
    )
}

export default Login