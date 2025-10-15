
import Logo from "./Logo"
import drafterIcon from '../img/draft_icon.png';
import { useNavigate } from "react-router-dom";
import { CREATE_GAME, HOME, PSW_RESET, SIGNUP } from "../utils/routes";
import { userAuth } from "../service/userService";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/slice/userSlice";
import { resetTeam } from "../store/slice/teamSlice";
import { useEffect, useState } from "react";

function Login() {

    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!user || Object.keys(user).length !== 0) {
            navigate(HOME);
            return;
        }
    }, []);

    function login() {
        if (email && password) {
            userAuth(email, password).then((response) => {
                dispatch(setUser(response.data.objResponse))
                dispatch(resetTeam());
                navigate(HOME)
            }).catch(error => {
                console.log(error.response.data.response)
                setError(true)
                // alert('Credenziali errate')
            })
        } else {
            alert('Inserire email e password')
        }
    }

    function handleKey(e) {
        if (e.key === "Enter") {
            login();
        }
    }

    return (
        <div
            className="login-container d-flex align-items-center justify-content-center"
            style={{
                minHeight: "70vh"
            }}
        >
            <div className="d-flex flex-column flex-lg-row align-items-center justify-content-center gap-5 w-100 px-4">

                {/* Logo e descrizione */}
                <div className="text-lg-start">
                    <div className="d-flex justify-content-center mb-4">
                        <Logo />
                    </div>

                    <h2 className="mt-4 text-center text-lg-start">MANAGE YOUR DRAFTS</h2>
                    <p className="mt-2 text-center text-lg-start">
                        Use the drafter for BO1, BO3, or BO5 series — even fearless mode.
                    </p>

                    <h5 className="text-center text-lg-start">REGISTER TO MANAGE</h5>
                    <p className="mt-2 text-center text-lg-start" style={{ fontSize: "0.95rem" }}>
                        Your champion pool, create or join teams,<br />
                        and refine strategies with champion and team stats.
                    </p>
                </div>

                {/* Login */}
                <div className="d-flex flex-column align-items-center">
                    <div
                        className="login-box p-4 rounded shadow text-center"
                        style={{
                            backgroundColor: "rgba(0,0,0,0.7)",
                            minWidth: "300px",
                            maxWidth: "350px"
                        }}
                    >
                        <h4 className="fw-bold mb-4">SIGN IN</h4>
                        <form>
                            <div className="form-floating mb-3">
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
                            <div className="form-floating mb-3">
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
                            <div className={`error-msg ${!error ? 'hidden' : ''}`}>
                                Invalid credentials.{" "}
                                <span
                                    className="text-warning "
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigate(PSW_RESET)}
                                >
                                    Forgot password?
                                </span>
                            </div>

                            <button
                                type="button"
                                className="btn btn-purple w-100 fw-bold"
                                onClick={() => login()}
                            >
                                LOGIN
                            </button>
                        </form>
                        <div className="mt-3">
                            Don’t have an account?{" "}
                            <span
                                className="text-warning "
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(SIGNUP)}
                            >
                                Sign up
                            </span>
                        </div>
                        <div className="mt-4 text-center">
                            <a
                                className="btn btn-warning btn-lg fw-bold mt-2 w-100 d-flex align-items-center justify-content-center gap-2"
                                href={CREATE_GAME}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span>DRAFTER</span>
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )


}

export default Login;
