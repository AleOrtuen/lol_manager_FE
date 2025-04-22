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
            alert('Utente registrato correttamente');
            navigate(LOGIN);
        }).catch(error => {
            alert('Utente già registrato');
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
                    setForm(prevForm => ({ ...prevForm, error: 'Username di almeno 3 caratteri. ' }));
                } else {
                    if (form.error === 'Username di almeno 3 caratteri. ') {
                        setForm(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
            case 'email':
                if (!validEmail(value) && value != '') {
                    setForm(prevForm => ({ ...prevForm, error: 'Email non valida. ' }));
                } else {
                    if (form.error === 'Email non valida. ') {
                        setForm(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
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
        <div>
            <Logo />
            <h1 className="display-6">TEAM MANAGER</h1>
            <br/>
            <h5 className="fw-bolder">Registrazione utente</h5>
            <div className="row justify-content-center">
                <div className="col-8 col-lg-4 col-md-6 col-sm-6">
                    <form>
                        <div className="form-floating mb-2">
                            <input
                                className="form-control"
                                type="text"
                                id="username"
                                name="username"
                                value={form.username}
                                placeholder="Username"
                                onChange={(e) => handleChange(e)}
                                onKeyDown={handleKey}
                                onBlur={(e) => errorChange(e)}
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
                                onChange={(e) => handleChange(e)}
                                onKeyDown={handleKey}
                                onBlur={(e) => errorChange(e)}
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
                                onChange={(e) => handleChange(e)}
                                onKeyDown={handleKey}
                                onBlur={(e) => errorChange(e)}
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
                                value={form.password2}
                                placeholder="Digita di nuovo la password"
                                onChange={(e) => handleChange(e)}
                                onKeyDown={handleKey}
                                onBlur={(e) => errorChange(e)}
                                style={{
                                    borderColor: validPassword2(form.password2) ? 'green' : (form.password2 !== '' ? 'red' : ''),
                                    borderWidth: (form.password2 !== '' ? '3px' : '0')
                                }}
                            />
                            <label htmlFor="password2">Digita di nuovo la passsword</label>
                        </div>
                        <div className="form-floating ">
                            <select
                                className="form-select"
                                id="floatingSelect"
                                name="pRole"
                                value={form.pRole || ''}
                                onChange={(e) => handleChange(e)}
                                onKeyDown={handleKey}
                                aria-label="Floating label select example"
                            >
                                <option value="">No Role</option>
                                <option value="top">Top</option>
                                <option value="jng">Jungle</option>
                                <option value="mid">Mid</option>
                                <option value="adc">Adc</option>
                                <option value="sup">Support</option>
                            </select>
                            <label htmlFor="floatingSelect">Primary role</label>
                        </div>
                    </form>
                    <div>
                        &nbsp;{form.error}
                    </div> <br />
                    <button
                        className="btn btn-outline-secondary btn-lg"
                        disabled={!validForm()}
                        onClick={() => userRegistration()}
                    >
                        Registrati
                    </button> <br /><br />
                    <a onClick={() => navigate(LOGIN)}>Torna alla home page</a> <br />
                </div>
            </div>

        </div>
    )
}

export default SignUp