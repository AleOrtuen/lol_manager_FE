import { useState } from "react"
import Navbar from "./Navbar"
import { useLocation } from "react-router-dom"
import { teamCompSave } from "../service/teamCompService";

function CompForm() {

    const location = useLocation();
    const [formComp, setFormComp] = useState({
        idTeam: location.state.idTeam,
        name: '',
        descr: '',
        error: ''
    })

    const compSave = () => {
        const comp = {
            team: {
                idTeam: formComp.idTeam
            },
            name: formComp.name,
            descr: formComp.descr
        }

        teamCompSave(comp)
            .then((response) => {
                console.log(response.data);
                alert('Comp creata correttamente');
            })
            .catch(error => {
                console.log(error.response.data.response);
                alert('Errore nella creazione della comp');
            })
    }

    // GESTISCE GLI ERRORI DI INSERIMENTO DA STAMPARE A SCHERMO
    const errorChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'name':
                if (!validName(value) && value != '') {
                    setFormComp(prevForm => ({ ...prevForm, error: 'Nome di almeno 3 caratteri. ' }));
                } else {
                    if (formComp.error === 'Nome di almeno 3 caratteri. ') {
                        setFormComp(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
            case 'descr':
                if (!validDescr(value) && value != '') {
                    setFormComp(prevForm => ({ ...prevForm, error: 'Descrizione di massimo 255 caratteri.' }));
                } else {
                    if (formComp.error === 'Descrizione di massimo 255 caratteri.') {
                        setFormComp(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
            default: break;
        }
    }

    const validForm = () => {
        return validName(formComp.name) &&
            validDescr(formComp.descr);
    }

    const validName = (name) => {
        return name !== ''
            && name.length >= 3
            && name.length <= 50;
    }

    const validDescr = (descr) => {
        return descr !== ''
            && descr.length <= 255;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormComp((prevData) => ({
            ...prevData,
            [name]: value
        }));
        errorChange(e);
    }

    function handleKey(e) {
        if (e.key === "Enter") {
            compSave();
        }
    }
    return (
        <div>
            <Navbar />
            <header className="bg-gray bg-gradient text-white">
                <h1 className="display-6">CREAZIONE TEAM COMP</h1>
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
                                    value={formComp.name}
                                    placeholder="nome"
                                    onChange={(e) => handleChange(e)}
                                    onKeyDown={handleKey}
                                    onBlur={(e) => errorChange(e)}
                                    style={{
                                        borderColor: validName(formComp.name) ? 'green' : (formComp.name !== '' ? 'red' : ''),
                                        borderWidth: (formComp.name !== '' ? '3px' : '0')
                                    }}
                                />
                                <label htmlFor="username">Nome</label>
                            </div>
                            <div class="form-floating mb-3">
                                <textarea
                                    class="form-control"
                                    id="descr"
                                    name="descr"
                                    value={formComp.descr}
                                    placeholder="descrizione"
                                    onChange={(e) => handleChange(e)}
                                    onKeyDown={handleKey}
                                    onBlur={(e) => errorChange(e)}
                                    style={{
                                        borderColor: validDescr(formComp.descr) ? 'green' : (formComp.descr !== '' ? 'red' : ''),
                                        borderWidth: (formComp.descr !== '' ? '3px' : '0')
                                    }}
                                />
                                <label htmlFor="descr">Descrizione</label>
                            </div>
                        </form>
                        <div>
                            &nbsp;{formComp.error}
                        </div> <br />
                        <button
                            class="btn btn-outline-secondary btn-lg"
                            disabled={!validForm()}
                            onClick={() => compSave()}
                        >
                            Crea comp
                        </button> <br />
                    </div>
                </div>
            </header>
        </div>
    )
}

export default CompForm