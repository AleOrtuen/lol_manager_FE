import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { TEAM, TEAMS } from "../utils/routes";
import { teamDelete, teamUpdate } from "../service/teamService";
import { teamMemberDelete, teamMemberDeleteTeam, teamMemberSave, teamMemberUpdate } from "../service/teamMemberService";
import { userFindByEmail } from "../service/userService";
import { EMAIL_REGEX } from "../utils/costanti";

import topIco from "../img/roles/top_ico.png";
import jngIco from "../img/roles/jng_ico.png";
import midIco from "../img/roles/mid_ico.png";
import adcIco from "../img/roles/adc_ico.png";
import supIco from "../img/roles/sup_ico.png";
import fillIco from "../img/roles/fill_ico.png";
import { useSelector } from "react-redux";

const rolesData = [
    { role: "top", label: "Top", image: topIco },
    { role: "jng", label: "Jungle", image: jngIco },
    { role: "mid", label: "Mid", image: midIco },
    { role: "adc", label: "ADC", image: adcIco },
    { role: "sup", label: "Support", image: supIco },
    { role: "fill", label: "Fill", image: fillIco },
];

function TeamUpdatePage({ team: propTeam, members: propMembers, membersRole: propMembersRole }) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.user);
    const teamFromState = location.state?.team;
    const membersFromState = location.state?.members;
    const membersRoleFromState = location.state?.membersRole;

    const [team, setTeam] = useState(propTeam || teamFromState || {
        idTeam: "",
        name: "",
        tag: "",
        img: "",
        opgg: "",
        file: null,
    });
    const [preview, setPreview] = useState(baseUrl + team.img || null);
    const [error, setError] = useState("");
    const [membersList, setMembersList] = useState([]);
    const [newMember, setNewMember] = useState("");

    // Inizializza la lista dei membri unendo members e membersRole
    useEffect(() => {
        const membersData = propMembers || membersFromState || [];
        const rolesData = propMembersRole || membersRoleFromState || [];

        const mergedMembers = membersData.map(member => {
            const roleInfo = rolesData.find(r => r.idUser === member.idUser);
            return {
                ...member,
                pRole: roleInfo?.role || member.pRole || "fill",
                admin: roleInfo?.admin || false,
            };
        });

        setMembersList(mergedMembers);
    }, [propMembers, membersFromState, propMembersRole, membersRoleFromState]);

    // --- VALIDAZIONI ---
    const validName = (name) => name.length >= 2 && name.length <= 50;
    const validTag = (tag) => tag.length >= 2 && tag.length <= 5;
    const validEmail = (email) => EMAIL_REGEX.test(email);
    const validForm = () => validName(team.name) && validTag(team.tag);

    // --- HANDLER INPUT ---
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "file") {
            const file = files[0];
            setTeam((prev) => ({ ...prev, file }));
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setPreview(reader.result);
                reader.readAsDataURL(file);
            } else setPreview(null);
        } else {
            setTeam((prev) => ({ ...prev, [name]: value }));
        }

        if (name === "name" && value && !validName(value)) setError("Nome di almeno 2 caratteri.");
        else if (name === "tag" && value && !validTag(value)) setError("Tag di almeno 2 caratteri e massimo 5.");
        else setError("");
    };

    // --- UPDATE TEAM ---
    const handleUpdate = async () => {
        try {
            const teamForm = {
                idTeam: team.idTeam,
                name: team.name,
                tag: team.tag,
                img: team.img,
                opgg: team.opgg
            };
            await teamUpdate(teamForm, team.file);
            alert("Team aggiornato con successo!");
            //   navigate(TEAM, { state: { idTeam: team.idTeam } });
        } catch (err) {
            console.error(err);
            alert("Errore durante l'aggiornamento del team");
        }
    };

    // --- UPDATE MEMBER ROLE ---
    const updateMemberRole = async (memberId, role, admin) => {
        try {
            await teamMemberUpdate({
                user: { idUser: memberId },
                team: { idTeam: team.idTeam },
                role: role || "fill",
                admin: admin || false,
            });
            alert("Ruolo aggiornato!");
        } catch (err) {
            console.error(err);

            // --- 🔍 Controlla il codice di stato HTTP ---
            if (err.response && err.response.status === 409) {
                alert("Il team deve avere almeno un admin user");
            } else {
                alert("Errore durante il salvataggio del ruolo");
            }
        }
    };


    // --- GESTIONE MEMBRI ---
    const addMember = async () => {
        if (!validEmail(newMember)) {
            setError("Email non valida.");
            return;
        }
        try {
            const response = await userFindByEmail(newMember);
            const newUserId = response.data.objResponse.idUser;

            const member = {
                user: { idUser: newUserId },
                team: { idTeam: team.idTeam },
                admin: false,
            };

            await teamMemberSave(member);
            setMembersList((prev) => [...prev, {
                idUser: newUserId,
                username: newMember,
                pRole: "fill",
                admin: false
            }]);
            setNewMember("");
            setError("");
            alert("Utente aggiunto al team");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.response || "Errore durante l'aggiunta del membro");
        }
    };

    const removeMember = async (idUser) => {
        try {
            await teamMemberDelete(idUser, team.idTeam);
            setMembersList((prev) => prev.filter((m) => m.idUser !== idUser));
            alert("Utente rimosso dal team.");
        } catch (err) {
            console.error(err);
            alert("Errore durante la rimozione del membro.");
        }
    };

    const deleteTeam = async () => {
        const confirmed = window.confirm("Sei sicuro di voler eliminare questo team?");
        if (!confirmed) return;

        await teamDelete(team.idTeam)
            .then(() => {
                alert('Team eliminato');
            })
            .catch(err => {
                console.log(err.response?.data?.response);
                alert('Errore nell`eliminazione del team');
            });

        await teamMemberDeleteTeam(team.idTeam).catch(err => {
            console.log(err.response?.data?.response);
            alert('Errore nell`eliminazione dei team members');
        });

        navigate(TEAMS);
    };

    const leaveTeam = async () => {
        const confirmed = window.confirm("Sei sicuro di voler lasciare questo team?");
        if (!confirmed) return;

        // 1️⃣ Trova tutti gli admin attuali
        const adminList = membersList.filter(member => member.admin);

        // 2️⃣ Verifica se l'utente corrente è admin
        const isUserAdmin = membersList.find(
            member => member.idUser === user.idUser && member.admin
        );

        // 3️⃣ Se è l’unico admin → blocca l’uscita
        if (isUserAdmin && adminList.length === 1) {
            alert("Il team deve avere almeno un admin. Dai i permessi a un altro utente prima di lasciare il team.");
            return;
        }

        try {
            await teamMemberDelete(user.idUser, team.idTeam);
            alert("Hai lasciato il team con successo.");
            navigate(TEAMS);
        } catch (err) {
            console.error(err);
            alert("Errore durante la rimozione dal team.");
        }
    };


    return (
        <div>
            <Navbar />
            <header className="bg-gray bg-gradient text-white py-5">
                <div className="container">
                    <h1 className="display-6 text-center mb-5">TEAM FORM</h1>

                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-md-10 col-sm-12">
                            <div className="card bg-dark bg-opacity-75 p-4 rounded-4 shadow-lg" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
                                <div className="row align-items-center">
                                    {/* COLONNA IMMAGINE */}
                                    <div className="col-md-5 d-flex flex-column align-items-center mb-4 mb-md-0">
                                        <label
                                            htmlFor="file"
                                            className="d-flex align-items-center justify-content-center"
                                            style={{
                                                width: "200px",
                                                height: "200px",
                                                border: "2px dashed #ccc",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                                backgroundColor: "#f8f9fa",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {preview ? (
                                                <img src={preview} alt="Anteprima" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            ) : (
                                                <span style={{ fontSize: "2rem", color: "#999" }}>+</span>
                                            )}
                                        </label>
                                        <input type="file" id="file" name="file" accept="image/*" onChange={handleChange} style={{ display: "none" }} />

                                        <div className="d-flex gap-2 mt-3 w-100" style={{ maxWidth: "200px" }}>
                                            <button
                                                className="btn btn-danger btn-sm flex-fill"
                                                onClick={deleteTeam}
                                            >
                                                Delete Team
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm flex-fill"
                                                onClick={leaveTeam}
                                            >
                                                Leave Team
                                            </button>
                                        </div>
                                    </div>

                                    {/* COLONNA INPUT */}
                                    <div className="col-md-7">
                                        <div className="form-floating mb-3">
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={team.name}
                                                placeholder="nome"
                                                onChange={handleChange}
                                                style={{ borderColor: validName(team.name) ? "green" : team.name ? "red" : "", borderWidth: team.name ? "3px" : "0" }}
                                            />
                                            <label htmlFor="name">Nome</label>
                                        </div>

                                        <div className="form-floating mb-3">
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="tag"
                                                name="tag"
                                                value={team.tag}
                                                maxLength="5"
                                                placeholder="tag"
                                                onChange={handleChange}
                                                style={{ borderColor: validTag(team.tag) ? "green" : team.tag ? "red" : "", borderWidth: team.tag ? "3px" : "0" }}
                                            />
                                            <label htmlFor="tag">Tag</label>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input
                                                className="form-control"
                                                type="url"
                                                id="opgg"
                                                name="opgg"
                                                value={team.opgg}
                                                placeholder="https://www.op.gg/multisearch/euw?summoners=..."
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="opgg">Link multi opgg</label>
                                        </div>
                                        {error && <div className="text-warning mb-3">{error}</div>}

                                        <button className="btn btn-purple w-100 fw-bold" disabled={!validForm()} onClick={handleUpdate}>
                                            Save
                                        </button>
                                    </div>
                                </div>

                                {/* SEZIONE MEMBRI */}
                                <hr className="text-light my-4" />
                                <h5 className="text-center mb-3 text-white">Team members</h5>

                                <table className="table align-middle" style={{ backgroundColor: "transparent" }}>
                                    <tbody>
                                        {membersList.length > 0 ? (
                                            membersList.map((m) => {
                                                const roleObj = rolesData.find(r => r.role === m.pRole?.toLowerCase()) || rolesData[5];
                                                return (
                                                    <tr key={m.idUser} className="text-white">
                                                        <td className="align-middle" style={{ backgroundColor: "transparent", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <img src={roleObj.image} alt={roleObj.role} style={{ width: "24px", height: "24px" }} />
                                                                <span className="text-white">{m.username}</span>
                                                            </div>
                                                        </td>
                                                        <td className="align-middle" style={{ backgroundColor: "transparent", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
                                                            <select
                                                                className="form-select form-select-sm"
                                                                value={m.pRole || "fill"}
                                                                onChange={(e) => {
                                                                    const newRole = e.target.value;
                                                                    setMembersList(prev =>
                                                                        prev.map(member => member.idUser === m.idUser ? { ...member, pRole: newRole } : member)
                                                                    );
                                                                }}
                                                            >
                                                                {rolesData.map(r => (
                                                                    <option key={r.role} value={r.role}>{r.label}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td className="align-middle text-end" style={{ backgroundColor: "transparent", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
                                                            <div className="d-flex gap-2 justify-content-end align-items-center">
                                                                <div className="form-check form-switch">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        role="switch"
                                                                        id={`admin-${m.idUser}`}
                                                                        checked={m.admin || false}
                                                                        disabled={
                                                                            // Disabilita lo switch se l’utente è l’unico admin e sta tentando di togliersi il ruolo
                                                                            m.admin && membersList.filter(member => member.admin).length === 1
                                                                        }
                                                                        onChange={(e) => {
                                                                            const isAdmin = e.target.checked;
                                                                            const adminCount = membersList.filter(member => member.admin).length;

                                                                            // Impedisci la rimozione se l'utente è l'ultimo admin
                                                                            if (!isAdmin && m.admin && adminCount === 1) {
                                                                                alert("Il team deve avere almeno un admin.");
                                                                                return;
                                                                            }

                                                                            setMembersList(prev =>
                                                                                prev.map(member =>
                                                                                    member.idUser === m.idUser ? { ...member, admin: isAdmin } : member
                                                                                )
                                                                            );
                                                                        }}
                                                                        style={{ cursor: "pointer" }}
                                                                    />



                                                                    <label
                                                                        className="form-check-label text-white small"
                                                                        htmlFor={`admin-${m.idUser}`}
                                                                        style={{ cursor: "pointer" }}
                                                                    >
                                                                        Admin
                                                                    </label>
                                                                </div>
                                                                <button
                                                                    className="btn btn-success btn-sm"
                                                                    onClick={() => updateMemberRole(m.idUser, m.pRole, m.admin)}
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => removeMember(m.idUser)}
                                                                    disabled={m.idUser === user.idUser}
                                                                    title={m.idUser === user.idUser ? "Non puoi rimuovere te stesso" : ""}
                                                                >
                                                                    Remove
                                                                </button>

                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center text-secondary" style={{ backgroundColor: "transparent", border: "none" }}>
                                                    Nessun membro presente
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* INPUT NUOVO MEMBRO */}
                                <div className="form-floating mb-3">
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="newMember"
                                        name="newMember"
                                        value={newMember}
                                        placeholder="Email nuovo membro"
                                        onChange={(e) => setNewMember(e.target.value)}
                                        style={{ borderColor: validEmail(newMember) ? "green" : newMember ? "red" : "", borderWidth: newMember ? "3px" : "0" }}
                                    />
                                    <label htmlFor="newMember">New member's email</label>
                                </div>

                                <button className="btn btn-purple w-100 fw-bold" disabled={!validEmail(newMember)} onClick={addMember}>
                                    Add member
                                </button>

                                <div className="text-center mt-4">
                                    <span className="text-warning" style={{ cursor: "pointer" }} onClick={() => navigate(TEAM, { state: { idTeam: team.idTeam } })}>
                                        Back to team
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default TeamUpdatePage;