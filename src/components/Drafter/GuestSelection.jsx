import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/slice/userSlice";
import { setTeam, resetTeam } from "../../store/slice/teamSlice";
import { teamFindAll, teamFindById, teamSave } from "../../service/teamService";
import { useNavigate, useParams } from "react-router-dom";
import { SIGNUP, PSW_RESET } from "../../utils/routes";
import { gameUpdate } from "../../service/gameService";
import { userAuth, userFindTeams } from "../../service/userService";

function GuestSelection({ game }) {

    const user = useSelector((state) => state.user);
    const teams = useSelector((state) => state.team);
    const { idRoom, role } = useParams();
    const [idTeam, setIdTeam] = useState();
    const [guestView, setGuestView] = useState(0);
    const [guestName, setGuestName] = useState();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

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

    useEffect(() => {
        if (teams && teams.length > 0) {
            setIdTeam(teams[0].idTeam);
        }
    }, [teams]);

    const login = async () => {
        if (email && email !== ''
            && password && password !== ''
        ) {

            await userAuth(email, password).then((response) => {
                dispatch(setUser(response.data.objResponse))
                dispatch(resetTeam());
                setError(false);
            }).catch(error => {
                console.log(error.response.data.response)
                setError(true);
            })
        } else {
            alert('Please enter email and password')
        }
    }

    const teamSelection = async () => {
        let teamKey;
        if (role === 'player1') {
            teamKey = 'team1';
        }
        if (role === 'player2') {
            teamKey = 'team2';
        }

        const updateTeam = {
            idGame: game.idGame,
            [teamKey]: {
                idTeam: idTeam
            },
            style: game.style,
            fearless: game.fearless
        }

        try {
            // ✅ Assicurati che la richiesta abbia il tempo di completarsi
            const response = await gameUpdate(updateTeam);
            console.log("Update successful:", response);

            // ✅ Aspetta un attimo prima di eventuali redirect/navigazioni
            await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
            console.error("Update error:", error);
            if (error.response) {
                console.log(error.response.data.response);
            } else if (error.request) {
                console.log("No response received");
            } else {
                console.log("Request setup error:", error.message);
            }
        }
    }

    const guestTeamSelection = async () => {
        let teamKey;
        if (role === 'player1') {
            teamKey = 'team1';
        }
        if (role === 'player2') {
            teamKey = 'team2';
        }

        const newGuestTeam = {
            name: guestName,
            tag: Math.random().toString(36).substring(2, 7).toUpperCase(),
            guest: true
        }

        let newTeam;

        await teamSave(newGuestTeam)
            .then((response) => {
                newTeam = response.data.objResponse;
            })
            .catch(error => {
                console.log(error.response.data.response);
                alert("Registered team");
            })

        const updateTeam = {
            idGame: game.idGame,
            [teamKey]: {
                idTeam: newTeam.idTeam
            },
            style: game.style,
            fearless: game.fearless
        }

        await gameUpdate(updateTeam)
            .then((response) => {

            })
            .catch(error => {
                console.log(error.response.data.response);
            })

    }

    const viewForm = () => {
        if (guestView === 0) {
            setGuestView(1);
        } else {
            setGuestView(0)
        }
    }

    function handleKey(e) {
        if (e.key === "Enter") {
            login();
        }
    }

    return (
        <div className="container" style={{ paddingTop: "20px", minHeight: "70vh" }}>
            <div className="d-flex flex-column align-items-center justify-content-center px-4">

                {/* Titolo */}
                <h1 className="display-6 mb-4 text-center">GAME ACCESS</h1>

                {/* Box Login/Team Selection */}
                <div
                    className="login-box p-4 rounded shadow"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.7)",
                        minWidth: "300px",
                        maxWidth: "450px",
                        width: "100%"
                    }}
                >
                    <form>
                        {user && Object.keys(user).length === 0 ? (
                            <>
                                <h4 className="fw-bold mb-4">SIGN IN</h4>
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
                                        className="text-warning"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => navigate(PSW_RESET)}
                                    >
                                        Forgot password?
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-purple w-100 fw-bold mb-3"
                                    onClick={() => login()}
                                >
                                    LOGIN
                                </button>
                                <div className="text-center">
                                    Don't have an account?{" "}
                                    <span
                                        className="text-warning"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => navigate(SIGNUP)}
                                    >
                                        Sign up
                                    </span>
                                </div>
                            </>
                        ) : (
                            teams && teams.length > 0 ? (
                                <>
                                    <p className="mb-3">Welcome <strong>{user.username}</strong>, select a team.</p>
                                    <div className="form-floating mb-3">
                                        <select
                                            className="form-select"
                                            id="floatingSelect"
                                            name="team"
                                            value={idTeam || ''}
                                            onChange={(e) => setIdTeam(Number(e.target.value))}
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
                                    <button
                                        type="button"  // ✅ IMPORTANTE: previene il submit
                                        className="btn btn-purple w-100 fw-bold"
                                        onClick={(e) => {
                                            e.preventDefault(); // ✅ Previene comportamenti default
                                            teamSelection();
                                        }}
                                    >
                                        ENTER
                                    </button>
                                </>
                            ) : (
                                <p className="text-center">You don't have any teams, continue as guest</p>
                            )
                        )}
                    </form>

                    <hr className="my-4" style={{ borderColor: "rgba(255,255,255,0.3)" }} />

                    {/* Sezione Guest */}
                    <div className="text-center">
                        <button
                            className="btn btn-warning w-100 fw-bold mb-3"
                            onClick={() => viewForm()}
                        >
                            {guestView === 0 ? 'CONTINUE AS GUEST' : 'CANCEL'}
                        </button>

                        {guestView === 1 && (
                            <>
                                <div className="form-floating mb-3">
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="guestName"
                                        value={guestName}
                                        placeholder="Team name"
                                        onChange={(e) => setGuestName(e.target.value)}
                                    />
                                    <label htmlFor="guestName">Team name</label>
                                </div>
                                <button
                                    className="btn btn-purple w-100 fw-bold"
                                    onClick={() => guestTeamSelection()}
                                >
                                    ENTER AS GUEST
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GuestSelection