import { useState } from "react"
import Navbar from "./Navbar"
import { teamSave } from "../service/teamService";
import { useNavigate } from "react-router-dom";
import { TEAMS } from "../utils/routes";

function TeamForm() {

    const navigate = useNavigate();

    const [formTeam, setFormTeam] = useState({
        name: '',
        tag: '',
        error: ''
    });

    const teamRegistration = async () => {
        const team = {
            name: formTeam.name,
            tag: formTeam.tag
        }

        await teamSave(team)
            .then((response) => {
                console.log(response.data);
                alert('Team registrato correttamente');
            })
            .catch(error => {
                console.log(error.response.data.response);
                alert('Team esistente');
            })
        navigate(TEAMS);
    }
    
    // GESTISCE GLI ERRORI DI INSERIMENTO DA STAMPARE A SCHERMO
    const errorChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'name':
                if (!validName(value) && value != '') {
                    setFormTeam(prevForm => ({ ...prevForm, error: 'Nome di almeno 3 caratteri. ' }));
                } else {
                    if (formTeam.error === 'Nome di almeno 3 caratteri. ') {
                        setFormTeam(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
            case 'tag':
                if (!validTag(value) && value != '') {
                    setFormTeam(prevForm => ({ ...prevForm, error: 'Tag di almeno 2 caratteri e massimo 5.' }));
                } else {
                    if (formTeam.error === 'Tag di almeno 3 caratteri e massimo 5.') {
                        setFormTeam(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
            default: break;
        }
    }

    const validForm = () => {
        return validName(formTeam.name) &&
            validTag(formTeam.tag);
    }

    // METODI DI VALIDAZIONE DEGLI INPUT 
    const validName = (name) => {
        return name !== ''
            && name.length >= 3
            && name.length <= 50;
    }

    const validTag = (tag) => {
        return tag !== ''
            && tag.length >= 2
            && tag.length <= 5;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormTeam((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    function handleKey(e) {
        if (e.key === "Enter") {
            teamRegistration();
        }
    }

    return (
        <div>
            <Navbar />
            <header className="bg-gray bg-gradient text-white">
                <h1 className="display-6">CREAZIONE TEAM</h1>
                <br />
                <div className="row justify-content-center">
                    <div className="col-6">
                        <form>
                            <div className="form-floating mb-3">
                                <input
                                    class="form-control"
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formTeam.name}
                                    placeholder="nome"
                                    onChange={(e) => handleChange(e)}
                                    onKeyDown={handleKey}
                                    onBlur={(e) => errorChange(e)}
                                    style={{
                                        borderColor: validName(formTeam.name) ? 'green' : (formTeam.name !== '' ? 'red' : ''),
                                        borderWidth: (formTeam.name !== '' ? '3px' : '0')
                                    }}
                                />
                                <label htmlFor="username">Nome</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input
                                    class="form-control"
                                    type="text"
                                    id="tag"
                                    name="tag"
                                    maxLength="5"
                                    value={formTeam.tag}
                                    placeholder="tag"
                                    onChange={(e) => handleChange(e)}
                                    onKeyDown={handleKey}
                                    onBlur={(e) => errorChange(e)}
                                    style={{
                                        borderColor: validTag(formTeam.tag) ? 'green' : (formTeam.tag !== '' ? 'red' : ''),
                                        borderWidth: (formTeam.tag !== '' ? '3px' : '0')
                                    }}
                                />
                                <label htmlFor="username">Tag</label>
                            </div>
                        </form>
                        <div>
                            &nbsp;{formTeam.error}
                        </div> <br />
                        <button
                            class="btn btn-secondary btn-lg"
                            disabled={!validForm()}
                            onClick={() => teamRegistration()}
                        >
                            Crea team
                        </button> <br />
                    </div>
                </div>
            </header>
        </div>
    )
}

export default TeamForm