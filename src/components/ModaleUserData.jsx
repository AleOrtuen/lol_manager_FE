import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../utils/costanti";
import { userFindById, userUpdate } from "../service/userService";
import { resetAllSlices } from "../store/slice/resetAllSlice";
import { setUser, resetUser } from "../store/slice/userSlice";

function ModaleUserData({ toUpdate }) {

    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { field = '', value = '' } = toUpdate || {};
    const [updateUser, setUpdateUser] = useState({
        idUser: user.idUser || '',
        username: user.username || '',
        email: user.email || '',
        password: null,
        password2: null,
        pRole: user.pRole,
        admin: user.admin,
        error: ''
    });

    useEffect(() => {
        if (field === 'username') {
            setUpdateUser((prevData) => ({ ...prevData, username: value }));
        } else if (field === 'email') {
            setUpdateUser((prevData) => ({ ...prevData, email: value }));
        } else if (field === 'ruolo') {
            setUpdateUser((prevData) => ({ ...prevData, pRole: value }));
        }
        setUpdateUser((prevData) => ({ ...prevData, error: '' }));
    }, [field, value]);

    const validForm = () => {
        let valid = false;
        switch (field) {
            case 'username':
                if (validUsername(updateUser.username)) {
                    valid = true;
                }
                break;
            case 'email':
                if (validEmail(updateUser.email)) {
                    valid = true;
                }
                break;
            case 'ruolo':
                valid = true;
                break;
            case 'password':
                if (validPassword(updateUser.password) &&
                    validPassword2(updateUser.password2)) {
                    valid = true;
                }
                break;
            default: break;
        }
        return valid
    }

    const update = async () => {
        const user = {
            idUser: updateUser.idUser,
            username: updateUser.username,
            email: updateUser.email,
            password: updateUser.password,
            admin: updateUser.admin,
            pRole: updateUser.pRole
        }
        await userUpdate(user).then((response) => {
            console.log(response.data);
            alert('Utente aggiornato correttamente');
        }).catch(error => {
            alert('Errore nell`aggiornamento');
            console.log(error.response.data.response);
        })

        await userFindById(user.idUser).then((response) => {
            console.log(response.data)
            dispatch(resetUser());
            dispatch(setUser(response.data.objResponse))
        }).catch(error => {
            console.log(error.response.data.response)
            alert('Utente non trovato')
        })
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
        return updateUser.password === password2
            && PASSWORD_REGEX.test(password2)
            && password2.length <= 50;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdateUser((prevData) => ({
            ...prevData,
            [name]: value
        }));
        errorChange(e);
    }

    // GESTISCE GLI ERRORI DI INSERIMENTO DA STAMPARE A SCHERMO
    const errorChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'username':
                if (!validUsername(value) && value != '') {
                    setUpdateUser(prevForm => ({ ...prevForm, error: 'Username di almeno 3 caratteri. ' }));
                } else {
                    if (updateUser.error === 'Username di almeno 3 caratteri. ') {
                        setUpdateUser(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
            case 'email':
                if (!validEmail(value) && value != '') {
                    setUpdateUser(prevForm => ({ ...prevForm, error: 'Email non valida. ' }));
                } else {
                    if (updateUser.error === 'Email non valida. ') {
                        setUpdateUser(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
            case 'password':
                if (!validPassword(value) && value != '') {
                    setUpdateUser(prevForm => ({ ...prevForm, error: 'La password deve avere almeno 8 caratteri, una lettera maiuscola e un numero. ' }));
                } else {
                    if (updateUser.error === 'La password deve avere almeno 8 caratteri, una lettera maiuscola e un numero. ') {
                        setUpdateUser(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
            case 'password2':
                if (!validPassword2(value) && value != '') {
                    setUpdateUser(prevForm => ({ ...prevForm, error: 'Le password devono essere uguali. ' }));
                } else {
                    if (updateUser.error === 'Le password devono essere uguali. ') {
                        setUpdateUser(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
            default: break;
        }
    }

    // ALLA PRESSIONE DI INVIO REGISTRA
    function handleKey(e) {
        if (e.key === "Enter") {
            update();
        }
    }

    return (
        <div>
            <div
                class="modal fade"
                id="modal"
                tabindex="-1"
                aria-labelledby="modalLabel"
                aria-hidden="true"
            >
                <div class="modal-dialog">
                    <div class="modal-content custom-modal-bg">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="modalLabel">
                                Modifica {field}
                            </h1>
                            <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                            </button>
                        </div>
                        <div class="modal-body">
                            <form onSubmit={(e) => { 
                                e.preventDefault(); 
                            }}>
                                {field && field !== "ruolo" ? (
                                    field === "password" ? (
                                        <>
                                            <div className="form-floating mb-3">
                                                <input
                                                    className="form-control"
                                                    type="password"
                                                    id="password"
                                                    name="password"
                                                    value={updateUser.password}
                                                    placeholder="password"
                                                    onChange={(e) => handleChange(e)}
                                                    onBlur={(e) => errorChange(e)}
                                                    onKeyDown={handleKey}
                                                />
                                                <label htmlFor="password">password</label>
                                            </div>
                                            <div className="form-floating mb-3">
                                                <input
                                                    className="form-control"
                                                    type="password"
                                                    id="password2"
                                                    name="password2"
                                                    value={updateUser.password2}
                                                    placeholder="digita di nuovo la password"
                                                    onChange={(e) => handleChange(e)}
                                                    onBlur={(e) => errorChange(e)}
                                                    onKeyDown={handleKey}
                                                />
                                                <label htmlFor="password2">digita di nuovo la password</label>
                                            </div>
                                        </>
                                    ) :

                                        <div className="form-floating mb-3">
                                            <input
                                                className="form-control"
                                                type="text"
                                                id={field}
                                                name={field}
                                                value={updateUser[field] || ''}
                                                placeholder={field}
                                                onChange={(e) => handleChange(e)}
                                                onBlur={(e) => errorChange(e)}
                                                onKeyDown={handleKey}
                                            />
                                            <label htmlFor={field}>{field}</label>
                                        </div>

                                ) :
                                    <div className="form-floating">
                                        <select
                                            className="form-select"
                                            id="floatingSelect"
                                            name="pRole"
                                            value={updateUser.pRole || ''}
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
                                }

                            </form>

                        </div>
                        &nbsp;{updateUser.error}
                        <div class="modal-footer">
                            <button
                                type="button"
                                class="btn btn-secondary btn-lg"
                                disabled={!validForm()}
                                onClick={() => update()}
                            >
                                Salva
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModaleUserData