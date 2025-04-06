import { useState } from "react";
import { useSelector } from "react-redux"
import Navbar from "./Navbar";
import Champions from "./Champions";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../utils/costanti";
import { userUpdate } from "../service/userService";
import topIco from '../img/roles/top.webp';
import jngIco from '../img/roles/jng.webp';
import midIco from '../img/roles/mid.webp';
import adcIco from '../img/roles/adc.webp';
import supIco from '../img/roles/sup.webp';

function Account() {

    const user = useSelector( (state) => state.user);
    const teams = useSelector( (state) => state.team);
    const [form,setForm] = useState({
        idUtente: user.idUser,
        username: '',
        email: '',
        password: '',
        password2: '',
        pRole: '',
        error: ''
    })

    const roleImages = {
        top: topIco,
        jng: jngIco,
        mid: midIco,
        adc: adcIco,
        sup: supIco,
    };

    const roleImage = user && user.pRole ? roleImages[user.pRole] : null; 

    const handleChange = (e) => {
        const { name, value } = e.target; 
        setForm((prevData) => ({
            ...prevData,
            [name]: value 
        }));   
    }

    // METODO PER ATTIVARE IL PULSANTE REGISTRATI CHE RICHIAMA TUTTE LE VALIDAZIONI DEGLI INPUT 
    const validForm = () => {
        return validUsername(form.username)
            && validEmail(form.email)
            && validPassword(form.password)
            && validPassword2(form.password2)
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
        return PASSWORD_REGEX.test(password2) 
            && password2.length <= 50;
    }

    // GESTISCE GLI ERRORI DI INSERIMENTO DA STAMPARE A SCHERMO
    const errorChange = (e) => {
        const { name, value } = e.target; 
        switch(name) {
            case 'username':
                if (!validUsername(value) && value!='') {
                    setForm(prevForm => ({ ...prevForm, error: 'Username di almeno 3 caratteri. ' }));
                } else {
                    if(form.error === 'Username di almeno 3 caratteri. ') {
                    setForm(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
            case 'email':
                if (!validEmail(value) && value!='') {
                    setForm(prevForm => ({ ...prevForm, error: 'Email non valida. ' }));                    
                } else {
                    if(form.error === 'Email non valida. ') {
                        setForm(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
            case 'password', 'password2':
                if (!validPassword(value) && value!='') {
                    setForm(prevForm => ({ ...prevForm, error: 'La password deve avere almeno 8 caratteri, una lettera maiuscola e un numero. ' }));                    
                } else {
                    if(form.error === 'La password deve avere almeno 8 caratteri, una lettera maiuscola e un numero. ') {
                        setForm(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
           
            default: break;  
        }
    }

    const utenteUpdate = () => {
        console.log(user.email)
        console.log(user.username)
        const usernameV = form.username === '' ? user.username : form.username;
        const emailV = form.email === '' ? user.email : form.email;
        const passV = form.password === '' ? form.password2 : form.password;  
        const userNew = {
            idUtente: form.idUtente,
            username: usernameV,
            email: emailV,
            password: passV
        }
        userUpdate(userNew).then ( (response) => {
            console.log(response);
            alert('Utente aggiornato correttamente');
        }).catch( error => {
            alert('Errore nell\'aggiornamento');
            console.log(error.response.data.response);
        })
    }

    // ALLA PRESSIONE DI INVIO REGISTRA
    function handleKey(e) {
        if (e.key === "Enter") {
            userRegistration();
        }
    }

    return (
        <>

            {user && Object.keys(user).length > 0 ?
            <div>  
                <Navbar />
                <header className="bg-gray bg-gradient">
                <br/>       
                <h1>
                    {roleImage && (
                    <img 
                        src={roleImage} 
                        style={{
                        width: '50px', 
                        height: '50px', 
                        maxWidth: '50px', 
                        maxHeight: '50px',
                        marginRight: '5px',
                        marginBottom: '6px'
                        }} 
                        alt="Role icon"
                    />
                    )}
                    {user.username}
                </h1>
                {teams.map( (team) => 
                <div>
                    <span>{team.name}</span>
                    <br/>
                </div>
                )}
                <br/>

                <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Dati personali
                </button>
                <ul class="dropdown-menu bg-dark">
                    <li><a class="dropdown-item text-light" href="#">{user.username} </a></li>
                    <li><a class="dropdown-item text-light" href="#">{user.email}</a></li>
                    <li><a class="dropdown-item text-light" href="#">{user.pRole}</a></li>
                    <li><a class="dropdown-item text-light" href="#">Password</a></li>
                </ul>

                <br/><br/>
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div  
                            className="col p-1" 
                            style={{
                                // height: '50vh',
                                marginLeft: '10%',
                                marginRight: '10%'
                            }}
                        >
                            <div
                                className="rounded-top d-flex flex-column h-100"
                                style={{
                                    border: '5px solid #242424',
                                }}
                            >
                                <div className="bg-dark text-white text-center p-2">
                                    Champion Pool
                                </div>
                                <div className="flex-grow-1 overflow-auto p-2 text-center"
                                        style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '3px',
                                        justifyContent: 'center',
                                        alignContent: 'flex-start'
                                        }}
                                >
                                    <Champions champions={user.champions} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <h5>Aggiorna dati</h5>
                <br/> */}
                {/* <div class="row">       
                    <div class="col-md-4 offset-md-4 col-sm-8 offset-sm-2">
                        <form>
                            <div class="form-floating mb-3">
                                <input
                                    class="form-control"
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={form.username}
                                    placeholder="Username"
                                    onChange={(e) => handleChange(e)}
                                    onKeyDown={handleKey}
                                    onBlur={(e) => errorChange(e)}
                                    style={{
                                    borderColor: validUsername(form.username) ? 'green' : (form.username !== '' ? 'red' : '')
                                    }}
                                />
                                <label htmlFor="username">Username</label>
                            </div>              
                            <div class="form-floating mb-3">
                                <input
                                    class="form-control"
                                    type="text"
                                    name="email"
                                    id="email"
                                    value={form.email}
                                    placeholder="Email"
                                    onChange={(e) => handleChange(e)}
                                    onKeyDown={handleKey}
                                    onBlur={(e) => errorChange(e)}
                                    style={{
                                    borderColor: validEmail(form.email) ? 'green' : (form.email !== '' ? 'red' : '')
                                    }}
                                />
                                <label htmlFor="email">Email</label>
                            </div> 
                            <div class="form-floating mb-3">
                                <input
                                    class="form-control"
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={form.password}
                                    placeholder="Password"
                                    onChange={(e) => handleChange(e)}
                                    onKeyDown={handleKey}
                                    onBlur={(e) => errorChange(e)}
                                    style={{
                                    borderColor: validPassword(form.password) ? 'green' : (form.password !== '' ? 'red' : '')
                                    }}
                                />
                                <label htmlFor="password">Vecchia password</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input
                                    class="form-control"
                                    type="password"
                                    name="password2"
                                    id="password2"
                                    value={form.password2}
                                    placeholder="Password"
                                    onChange={(e) => handleChange(e)}
                                    onKeyDown={handleKey}
                                    onBlur={(e) => errorChange(e)}
                                    style={{
                                    borderColor: validPassword(form.password) ? 'green' : (form.password !== '' ? 'red' : '')
                                    }}
                                />
                                <label htmlFor="password">Nuova Password</label>
                            </div>
                        </form>
                        <div>
                            &nbsp;{form.error}
                        </div> <br/>
                        <button class="btn btn-outline-secondary btn-lg" onClick={() => utenteUpdate()}>Aggiorna</button> <br/><br/>
                    </div>
                </div>  */}
                </header>               
            </div>
            : <h3>Utente non loggato</h3>
            }
        </>
  


    )
}

export default Account