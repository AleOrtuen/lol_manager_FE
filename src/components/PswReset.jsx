import { useNavigate, useParams } from "react-router-dom";
import Logo from "./Logo";
import { useEffect, useState } from "react";
import { PASSWORD_REGEX } from "../utils/costanti";
import { LOGIN } from "../utils/routes";
import { tokenDelete, tokenFindByToken } from "../service/passwordResetTokenService";
import { userFindByEmail, userUpdate } from "../service/userService";

function PswReset() {

    const { token } = useParams();
    const [validToken, setValidToken] = useState(false);
    const [tokenObj, setTokenObj] = useState({});
    const [user, setUser] = useState();

    const navigate = useNavigate();

    const [form, setForm] = useState({
        password: '',
        password2: '',
        error: ''
    })

    useEffect(() => {
        tokenFindByToken(token)
            .then((response) => {
                setValidToken(true);
                setTokenObj(response.data.objResponse);
            })
            .catch(error => {
                console.log(error.response.data.response);
            })
    }, [token]);

    useEffect(() => {
        userFindByEmail(tokenObj.email)
            .then((response) => {
                setUser(response.data.objResponse);
            })
            .catch(error => {
                console.log(error.response.data.response);
            })
    }, [tokenObj]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    // ALLA PRESSIONE DI INVIO REGISTRA
    function handleKey(e) {
        if (e.key === "Enter") {

        }
    }

    // GESTISCE GLI ERRORI DI INSERIMENTO DA STAMPARE A SCHERMO
    const errorChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'password':
                if (!validPassword(value) && value != '') {
                    setForm(prevForm => ({ ...prevForm, error: 'La password deve avere almeno 8 caratteri, una lettera maiuscola e un numero. ' }));
                } else {
                    if (form.error === 'La password deve avere almeno 8 caratteri, una lettera maiuscola e un numero. ') {
                        setForm(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
            case 'password2':
                if (!validPassword2(value) && value != '') {
                    setForm(prevForm => ({ ...prevForm, error: 'Le password devono essere uguali. ' }));
                } else {
                    if (form.error === 'Le password devono essere uguali. ') {
                        setForm(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
            default: break;
        }
    }
    // METODO PER ATTIVARE IL PULSANTE REGISTRATI CHE RICHIAMA TUTTE LE VALIDAZIONI DEGLI INPUT 
    const validForm = () => {
        return validPassword(form.password)
            && validPassword2(form.password2);
    }

    // METODI DI VALIDAZIONE DEGLI INPUT 
    const validPassword = (password) => {
        return PASSWORD_REGEX.test(password)
            && password.length <= 50;
    }
    const validPassword2 = (password2) => {
        return form.password === password2
            && PASSWORD_REGEX.test(password2)
            && password2.length <= 50;
    }

    const update = async () => {
        const updateUser = {
            idUser: user.idUser,
            username: user.username,
            email: user.email,
            password: form.password,
            admin: user.admin,
            pRole: user.pRole
        }
        await userUpdate(updateUser).then((response) => {
            alert('Utente aggiornato correttamente');
        }).catch(error => {
            alert('Errore nell`aggiornamento');
            console.log(error.response.data.response);
        })

        await tokenDelete(token)
            .then((response) => {

            }).catch(error => {
                console.log(error.response.data.response);
        })
        
        navigate(LOGIN);

    }

    return validToken ? (
        <div
            className="signup-container d-flex align-items-center justify-content-center"
            style={{
                minHeight: "70vh"
            }}
        >
            <div className="d-flex flex-column flex-lg-row align-items-center justify-content-center gap-5 w-100 px-4">

                {/* Colonna sinistra con logo */}
                <div className="text-lg-start">
                    <div className="d-flex justify-content-center mb-4">
                        <Logo />
                    </div>

                    <h2 className="mt-4 text-center text-lg-start">PASSWORD RESET</h2>
                    <p className="mt-2 text-center text-lg-start">
                        Insert your new password
                    </p>
                </div>

                {/* Colonna destra con form */}
                <div className="d-flex flex-column align-items-center">
                    <div
                        className="signup-box p-4 rounded shadow text-center"
                        style={{
                            backgroundColor: "rgba(0,0,0,0.7)",
                            minWidth: "300px",
                            maxWidth: "350px"
                        }}
                    >
                        <h4 className=" mb-4">Password reset</h4>
                        <form>
                            <div className="form-floating mb-2">
                                <input
                                    className="form-control"
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={form.password}
                                    placeholder="Password"
                                    onChange={handleChange}
                                    onKeyDown={handleKey}
                                    onBlur={errorChange}
                                    style={{
                                        borderColor: validPassword(form.password) ? 'green' : (form.password !== '' ? 'red' : ''),
                                        borderWidth: (form.password !== '' ? '3px' : '0')
                                    }}
                                />
                                <label htmlFor="password">Password</label>
                            </div>

                            <div className="form-floating mb-2">
                                <input
                                    className="form-control"
                                    type="password"
                                    name="password2"
                                    id="password2"
                                    value={form.password2}
                                    placeholder="Repeat password"
                                    onChange={handleChange}
                                    onKeyDown={handleKey}
                                    onBlur={errorChange}
                                    style={{
                                        borderColor: validPassword2(form.password2) ? 'green' : (form.password2 !== '' ? 'red' : ''),
                                        borderWidth: (form.password2 !== '' ? '3px' : '0')
                                    }}
                                />
                                <label htmlFor="password2">Repeat password</label>
                            </div>
                        </form>

                        <div>&nbsp;{form.error}</div>

                        <button
                            className="btn btn-purple w-100 fw-bold"
                            disabled={!validForm()}
                            onClick={update}
                        >
                            Save
                        </button>

                        <div className="mt-3">
                            <span
                                className="text-warning"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(LOGIN)}
                            >
                                Back to home page
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <>
            <h2 className="mt-4 text-center">TOKEN EXPIRED</h2>
            <div className="mt-3">
                <span
                    className="text-warning"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(LOGIN)}
                >
                    Back to home page
                </span>
            </div>
        </>
    );

}

export default PswReset

