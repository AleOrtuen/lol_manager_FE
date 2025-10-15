import { useNavigate } from "react-router-dom"
import { useState } from "react";
import { userSave } from "../service/userService";
import Logo from "./Logo";
import { LOGIN } from "../utils/routes";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../utils/costanti";

function SignUp() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        pRole: null,
        error: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }


    const userRegistration = () => {
        const user = {
            username: form.username,
            email: form.email,
            password: form.password,
            pRole: form.pRole
        }

        userSave(user).then((response) => {
            alert('User registered successfully.');
            navigate(LOGIN);
        }).catch(error => {
            alert('User already registered.');
            console.log(error.response.data.response);
        })
    }

    // ALLA PRESSIONE DI INVIO REGISTRA
    function handleKey(e) {
        if (e.key === "Enter") {
            userRegistration();
        }
    }

    // GESTISCE GLI ERRORI DI INSERIMENTO DA STAMPARE A SCHERMO
    const errorChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'username':
                if (!validUsername(value) && value != '') {
                    setForm(prevForm => ({ ...prevForm, error: 'Username must be at least 3 characters long. ' }));
                } else {
                    if (form.error === 'Username must be at least 3 characters long. ') {
                        setForm(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
            case 'email':
                if (!validEmail(value) && value != '') {
                    setForm(prevForm => ({ ...prevForm, error: 'Invalid email address. ' }));
                } else {
                    if (form.error === 'Invalid email address. ') {
                        setForm(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
            case 'password':
                if (!validPassword(value) && value != '') {
                    setForm(prevForm => ({ ...prevForm, error: 'Password must be at least 8 characters long, with one uppercase letter and one number. ' }));
                } else {
                    if (form.error === 'Password must be at least 8 characters long, with one uppercase letter and one number. ') {
                        setForm(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
            case 'password2':
                if (!validPassword2(value) && value != '') {
                    setForm(prevForm => ({ ...prevForm, error: 'Passwords must match. ' }));
                } else {
                    if (form.error === 'Passwords must match. ') {
                        setForm(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
            default: break;
        }
    }

    // METODO PER ATTIVARE IL PULSANTE REGISTRATI CHE RICHIAMA TUTTE LE VALIDAZIONI DEGLI INPUT 
    const validForm = () => {
        return validUsername(form.username)
            && validEmail(form.email)
            && validPassword(form.password)
            && validPassword2(form.password2);
    }

    // METODI DI VALIDAZIONE DEGLI INPUT 
    const validUsername = (username) => {
        return username !== ''
            && username.length >= 3
            && username.length <= 50;
    }
    const validEmail = (email) => {
        return EMAIL_REGEX.test(email)
            && email.length <= 50;
    }
    const validPassword = (password) => {
        return PASSWORD_REGEX.test(password)
            && password.length <= 50;
    }
    const validPassword2 = (password2) => {
        return form.password === password2
            && PASSWORD_REGEX.test(password2)
            && password2.length <= 50;
    }

    return (
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

                    <h2 className="mt-4 text-center text-lg-start">JOIN THE COMMUNITY</h2>
                    <p className="mt-2 text-center text-lg-start">
                        Create your account, manage your drafts and teams,<br />
                        and start refining your strategies.
                    </p>
                </div>

                {/* Colonna destra con form */}
                <div className="d-flex flex-column align-items-center">
                    <div
                        className="signup-box p-4 rounded shadow text-center"
                        style={{
                            backgroundColor: "rgba(0,0,0,0.7)",
                            minWidth: "300px",
                            maxWidth: "350px",
                            width: "350px"
                        }}
                    >
                        <h4 className=" mb-4">Create account</h4>
                        <form>
                            <div className="form-floating mb-2">
                                <input
                                    className="form-control"
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={form.username}
                                    placeholder="Username"
                                    onChange={handleChange}
                                    onKeyDown={handleKey}
                                    onBlur={errorChange}
                                    style={{
                                        borderColor: validUsername(form.username) ? 'green' : (form.username !== '' ? 'red' : ''),
                                        borderWidth: (form.username !== '' ? '3px' : '0')
                                    }}
                                />
                                <label htmlFor="username">Username</label>
                            </div>

                            <div className="form-floating mb-2">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="email"
                                    id="email"
                                    value={form.email}
                                    placeholder="Email"
                                    onChange={handleChange}
                                    onKeyDown={handleKey}
                                    onBlur={errorChange}
                                    style={{
                                        borderColor: validEmail(form.email) ? 'green' : (form.email !== '' ? 'red' : ''),
                                        borderWidth: (form.email !== '' ? '3px' : '0')
                                    }}
                                />
                                <label htmlFor="email">Email</label>
                            </div>

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

                            <div className="form-floating mb-3">
                                <select
                                    className="form-select"
                                    id="floatingSelect"
                                    name="pRole"
                                    value={form.pRole || ''}
                                    onChange={handleChange}
                                    onKeyDown={handleKey}
                                >
                                    <option value="">No Role</option>
                                    <option value="top">Top</option>
                                    <option value="jng">Jungle</option>
                                    <option value="mid">Mid</option>
                                    <option value="adc">Adc</option>
                                    <option value="sup">Support</option>
                                    <option value="fill">Fill</option>
                                    <option value="coach">Coach</option>                                                                        
                                </select>
                                <label htmlFor="floatingSelect">Primary role</label>
                            </div>
                        </form>

                        <div className={`error-msg ${!form.error ? 'hidden' : ''}`}
                        style={{color:"red"}}
                        >
                            {form.error}
                        </div>


                        <button
                            className="btn btn-purple w-100 fw-bold"
                            disabled={!validForm()}
                            onClick={userRegistration}
                        >
                            Sign up
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
    )

}

export default SignUp