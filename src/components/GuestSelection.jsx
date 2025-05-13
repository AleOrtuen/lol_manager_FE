import { useEffect, useState } from "react";
import { userAuth, userFindTeams } from "../service/userService";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/slice/userSlice";
import { setTeam, resetTeam } from "../store/slice/teamSlice";
import { teamFindAll } from "../service/teamService";
import { useNavigate } from "react-router-dom";
import { SIGNUP } from "../utils/routes";

function GuestSelection() {

    const user = useSelector((state) => state.user);
    const teams = useSelector((state) => state.team);
    const [idTeam, setIdTeam] = useState('');
    const [guestName, setGuestName] = useState();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {

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

    }, [user]);

    const login = async () => {
        if (email && email !== ''
            && password && password !== ''
        ) {

            await userAuth(email, password).then((response) => {
                dispatch(setUser(response.data.objResponse))
                dispatch(resetTeam());
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
            <div>
                <h1 className="display-6">ACCESSO AL GAME</h1>
                <br />
                <div className="row justify-content-center">
                    <div className="col-8 col-lg-4 col-md-6 col-sm-6">
                        <form>
                            {user && Object.keys(user).length === 0 ?
                                <>
                                    <h5 className="fw-bolder">Login</h5>
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

                                </>
                                :
                                (teams && teams.length > 0 ? (
                                    <>
                                        <p>Benvenuto {user.username}, seleziona un team.</p>
                                        <div className="form-floating">
                                            <select
                                                className="form-select"
                                                id="floatingSelect"
                                                name="team"
                                                value={idTeam}
                                                onChange={(e) => setIdTeam(e.target.value)}
                                                // onKeyDown={handleKey}
                                                aria-label="Floating label select example"
                                            >
                                                {teams.map((team) => (
                                                    <option value={team.idTeam} key={team.idTeam}>
                                                        {team.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <label htmlFor="floatingSelect">Team</label>
                                        </div>
                                    </>
                                )
                                    : <p>Non hai teams continua come guest</p>
                                )
                            }
                        </form>
                        <br />
                        <button className="btn btn-outline-secondary btn-lg" onClick={() => login()}>
                            Entra
                        </button>
                        <br />
                        {user && Object.keys(user).length === 0 ?
                            <>
                                Non hai un account?
                                <a className="a-custom" onClick={() => navigate(SIGNUP)}> Registrati!</a><br />
                            </>
                            : null
                        }
                        <br /><br />
                        {/* <div className="form-floating mb-2">
                            <input
                                className="form-control"
                                type="text"
                                id="guestName"
                                value={guestName}
                                placeholder="Team name"
                                onChange={(e) => setGuestName(e.target.value)}
                            // onKeyDown={handleKey}
                            />
                            <label htmlFor="guestName">Team name</label>
                        </div>
                        <button className="btn btn-outline-secondary btn-lg">
                            Continua come guest
                        </button> */}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default GuestSelection