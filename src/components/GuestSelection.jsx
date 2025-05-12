import { useState } from "react";
import { useParams } from "react-router-dom";
import { userAuth } from "../service/userService";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slice/userSlice";
import { resetTeam } from "../store/slice/teamSlice";

function GuestSelection() {
    const { idRoom, role } = useParams();
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
        <div>
            <div className="d-flex align-items-center justify-content-center">
                <div className="col-10 col-md-6 text-center">
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
                            <br/><br/>
                            <h6>Continua come guest</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GuestSelection