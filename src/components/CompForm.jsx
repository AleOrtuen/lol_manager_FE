import { useState } from "react"
import Navbar from "./Navbar"
import { useLocation, useNavigate } from "react-router-dom"
import { teamCompSave } from "../service/teamCompService";
import { TEAM_COMP } from "../utils/routes";

function CompForm() {

    const location = useLocation();
    const navigate = useNavigate();
    const [formComp, setFormComp] = useState({
        idTeam: location?.state?.idTeam || '',
        name: '',
        descr: '',
        error: ''
    });


    const compSave = async () => {
        const comp = {
            team: {
                idTeam: formComp.idTeam
            },
            name: formComp.name,
            descr: formComp.descr
        }

        await teamCompSave(comp)
            .then((response) => {
                alert('Comp creata correttamente');
            })
            .catch(error => {
                console.log(error.response.data.response);
                alert('Errore nella creazione della comp');
            })
        // navigate(TEAM_COMP, navigate(TEAM_COMP, { state: { idTeam: location.state.idTeam } }));
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
                {formComp.idTeam !== '' ?
                    <div className="row justify-content-center">
                        <div className="col-6">
                            <form>
                                <div className="form-floating mb-3">
                                    <input
                                        className="form-control"
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
                                <div className="form-floating mb-3">
                                    <textarea
                                        className="form-control"
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
                                className="btn btn-secondary btn-lg"
                                disabled={!validForm()}
                                onClick={() => compSave()}
                            >
                                Crea comp
                            </button> <br /><br />
                            <a className="a-custom" onClick={() => navigate(TEAM_COMP, { state: { idTeam: formComp.idTeam } })}>Torna alle team comps</a> <br />
                        </div>
                    </div>
                    : <p>Nessun team selezionato</p>
                }
            </header>
        </div>
    )
}

export default CompForm