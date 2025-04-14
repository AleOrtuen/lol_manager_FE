import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { teamMemberDelete, teamMemberSave } from "../service/teamMemberService";
import { teamFindAll, teamFindMembers, teamUpdate } from "../service/teamService";
import { userFindByEmail } from "../service/userService";
import { resetTeam, setTeam } from "../store/slice/teamSlice";
import { EMAIL_REGEX } from "../utils/costanti";

function ModaleTeamData({ toUpdate, team }) {

    const dispatch = useDispatch();
    const { field = '', value = '' } = toUpdate || {};
    const [updateTeam, setUpdateTeam] = useState({
        idTeam: team.idTeam || '',
        name: team.name || '',
        tag: team.tag || '',
        img: team.img || '', 
        error: ''
    });

    const [updateMembers, setUpdateMembers] = useState([]);
    const [newMember, setNewMember] = useState();


    useEffect(() => {
        if (field === 'nome') {
            setUpdateTeam((prevData) => ({ ...prevData, name: value }));
        } else if (field === 'tag') {
            setUpdateTeam((prevData) => ({ ...prevData, tag: value }));
        } else if (field === 'membri') {
            setUpdateMembers(value);
        }
        setUpdateTeam((prevData) => ({ ...prevData, error: '' }));
    }, [field, value]);

    const validForm = () => {
        let valid = false;
        switch (field) {
            case 'nome':
                if (validName(updateTeam.name)) {
                    valid = true;
                }
                break;
            case 'tag':
                if (validTag(updateTeam.tag)) {
                    valid = true;
                }
                break;
            case 'membri':
                if (validEmail(newMember)) {
                    valid = true;
                }
                break;
            default: break;
        }
        return valid
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

    const validEmail = (email) => {
        return EMAIL_REGEX.test(newMember)
            && email.length <= 50;
    }

    // GESTISCE GLI ERRORI DI INSERIMENTO DA STAMPARE A SCHERMO
    const errorChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'name':
                if (!validName(value) && value != '') {
                    setUpdateTeam(prevForm => ({ ...prevForm, error: 'Nome di almeno 3 caratteri. ' }));
                } else {
                    if (updateTeam.error === 'Nome di almeno 3 caratteri. ') {
                        setUpdateTeam(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
            case 'tag':
                if (!validTag(value) && value != '') {
                    setUpdateTeam(prevForm => ({ ...prevForm, error: 'Tag di almeno 2 caratteri e massimo 5. ' }));
                } else {
                    if (updateTeam.error === 'Tag di almeno 2 caratteri e massimo 5. ') {
                        setUpdateTeam(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
            case 'member':
                if (!validEmail(value) && value != '') {
                    setUpdateTeam(prevForm => ({ ...prevForm, error: 'Email non valida. ' }));
                } else {
                    if (updateTeam.error === 'Email non valida. ') {
                        setUpdateTeam(prevForm => ({ ...prevForm, error: '' }));
                    }
                }
                break;
            default: break;
        }
    }

    const removePlayer = async (idUser) => {
        await teamMemberDelete(idUser, updateTeam.idTeam)
            .then((response) => {
                console.log(response.data);
                alert('Utente rimosso');
            })
            .catch(error => {
                console.log(error.response.data.response);
                alert('Utente non trovato');
            })

        await teamFindMembers(updateTeam.idTeam)
            .then((response) => {
                console.log('Members data:', response.data.objResponse);  // Log dei membri
                setUpdateMembers(response.data.objResponse);
            })
            .catch(error => {
                console.log('Error fetching members:', error.response?.data?.response || error.message);
            });

    }

    const addPlayer = async () => {

        let newUserId;
        await userFindByEmail(newMember)
            .then((response) => {
                console.log(response.data);
                newUserId = response.data.objResponse.idUser;
            })
            .catch(error => {
                console.log(error.response.data.response);
                alert('Utente non trovato');
            })

        const member = {
            user: {
                idUser: newUserId
            },
            team: {
                idTeam: updateTeam.idTeam
            }
        }

        await teamMemberSave(member)
            .then((response) => {
                console.log(response.data);
                alert('Utente aggiunto al team');
            })
            .catch(error => {
                console.log(error.response.data.response);
                alert('Utente già membro del team');
            })

        await teamFindMembers(updateTeam.idTeam)
            .then((response) => {
                console.log('Members data:', response.data.objResponse);  // Log dei membri
                setUpdateMembers(response.data.objResponse);
            })
            .catch(error => {
                console.log('Error fetching members:', error.response?.data?.response || error.message);
            });

    }

    const teamUpdateFunction = async () => {
        const team = {
            idTeam: updateTeam.idTeam,
            name: updateTeam.name,
            tag: updateTeam.tag,
            img: updateTeam.img
        }
        await teamUpdate(team)
            .then((response) => {
                console.log(response.data);
                setUpdateTeam(response.data.objResponse);
                alert('Team aggiornato');
            })
            .catch(error => {
                console.log(error.response.data.response);
                alert('Problema nell`aggiornamento');
            })

        await teamFindAll()
            .then((response) => {
                console.log(response.data);
                dispatch(resetTeam());
                dispatch(setTeam(response.data.objResponse));
            })
            .catch(error => {
                console.log(error.response.data.response);
            })

    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdateTeam((prevData) => ({
            ...prevData,
            [name]: value
        }));
        errorChange(e);
    }

    function handleKey(e) {
        if (e.key === "Enter") {
            addPlayer();
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
                            <form>
                                {field === "membri" ? (
                                    <>
                                        <table className="table table-dark table-hover">
                                            <tbody>
                                                {updateMembers.map((member, index) => (
                                                    <tr key={index}>
                                                        <td><b>{member.username}</b></td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => removePlayer(member.idUser)}
                                                            >
                                                                Rimuovi
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <h6>Aggiungi player</h6>
                                        <div className="form-floating mb-3">
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="member"
                                                name="member"
                                                value={newMember}
                                                placeholder="Email player"
                                                onChange={(e) => {
                                                    setNewMember(e.target.value);
                                                    errorChange(e);
                                                }}
                                                onKeyDown={handleKey}
                                                onBlur={(e) => errorChange(e)}                                                
                                                style={{
                                                    borderColor: validEmail(newMember) ? 'green' : (newMember !== '' ? 'red' : ''),
                                                    borderWidth: (newMember !== '' ? '3px' : '0')
                                                }}                                                
                                            />
                                            <label htmlFor="name">Email player</label>
                                        </div>
                                        <br />
                                    </>
                                ) : field === "nome" ? (
                                    <div className="form-floating mb-3">
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={updateTeam.name}
                                            placeholder="name"
                                            onChange={handleChange}
                                            onBlur={(e) => errorChange(e)}
                                            style={{
                                                borderColor: validName(updateTeam.name) ? 'green' : (updateTeam.name !== '' ? 'red' : ''),
                                                borderWidth: (updateTeam.name !== '' ? '3px' : '0')
                                            }}
                                        />
                                        <label htmlFor="name">Nome</label>
                                    </div>
                                ) : (
                                    <div className="form-floating mb-3">
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="tag"
                                            name="tag"
                                            value={updateTeam.tag}
                                            placeholder="tag"
                                            onChange={handleChange}
                                            onBlur={(e) => errorChange(e)}
                                            style={{
                                                borderColor: validTag(updateTeam.tag) ? 'green' : (updateTeam.tag !== '' ? 'red' : ''),
                                                borderWidth: (updateTeam.tag !== '' ? '3px' : '0')
                                            }}                                            
                                        />
                                        <label htmlFor="tag">Tag</label>
                                    </div>
                                )}
                            </form>

                        </div>
                        &nbsp;{updateTeam.error}
                        {field === "membri" ?
                            <div class="modal-footer">
                                <button
                                    type="button"
                                    class="btn btn-outline-secondary btn-lg"
                                    disabled={!validForm()}
                                    onClick={() => addPlayer()}
                                >
                                    Aggiungi
                                </button>
                            </div>
                            :
                            <div class="modal-footer">
                                <button
                                    type="button"
                                    class="btn btn-outline-secondary btn-lg"
                                    disabled={!validForm()}
                                    onClick={() => teamUpdateFunction()}
                                >
                                    Salva
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModaleTeamData