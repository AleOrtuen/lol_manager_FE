import { useState } from "react"
import Logo from "./Logo"
import { useNavigate } from "react-router-dom";
import { HOME, SIGNUP } from "../utils/routes";
import { userAuth } from "../service/userService";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slice/userSlice";

function Login() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function login() {
        if (email && email !== ''
            && password && password !== ''
        ) {
            const user = {
                email,
                password
            }

            userAuth(email, password).then((response) => {
                console.log(response.data)
                dispatch(setUser(response.data.objResponse))
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
                <h1 className="display-6">TEAM MANAGER</h1>
                <br/>
                <div className="row justify-content-center">
                    <div className="col-10 col-lg-5 col-md-6 col-sm-8">
                        Benvenuto nella versione alpha di LoL Team Manager!
                        Con LoL manager potrai facilmente gestire la tua lista di campioni giocabili, creare team e progettare le tue strategie.
                        Lo strumento Comp builder ti aiuterà nel drafting così da ottenere il miglior risultato possibile nel combinare i campioni del tuo team!
                    </div>
                </div>
                <br/>
                <h5 class="fw-bolder">Login</h5>               
                <div class="row justify-content-center">
                    <div class="col-8 col-lg-4 col-md-6 col-sm-6">
                        <form>
                            <div class="form-floating mb-2">
                                <input
                                    class="form-control"
                                    type="text"
                                    id="email"
                                    value={email}
                                    placeholder="Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={handleKey}
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div class="form-floating mb-2">
                                <input
                                    class="form-control"
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
                        <button class="btn btn-outline-secondary btn-lg" onClick={() => login()}>
                            Entra
                        </button>
                    </div>
                </div>
            </div>
            <br />
            {/* <p> */}
            Non hai un account?
            <a onClick={() => navigate(SIGNUP)}> Registrati!</a>

            {/* </p> */}
        </>
    )
}

export default Login