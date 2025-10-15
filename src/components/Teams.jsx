import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { teamDelete, teamFindAll } from "../service/teamService";
import { HOME, TEAM, TEAM_FORM } from "../utils/routes";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { teamMemberDeleteTeam, teamMemberFindTeam } from "../service/teamMemberService";
import { setTeam } from "../store/slice/teamSlice";

function Teams() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const teamsState = useSelector((state) => state.team);
    const teams = Array.isArray(teamsState) ? teamsState : [];
    const navigate = useNavigate();
    const [teamsMembersRole, setTeamsMembersRole] = useState({}); // { [idTeam]: [membersRole] }

    useEffect(() => {
        // Carica i membri per ogni team
        teams.forEach((team) => {
            teamMemberFindTeam(team.idTeam)
                .then(res => {
                    setTeamsMembersRole(prev => ({ ...prev, [team.idTeam]: res.data.objResponse }));
                })
                .catch(err => console.log("Errore caricamento membri team", err));
        });
    }, [teams]);

    const deleteTeam = (idTeam) => {
        const confirmed = window.confirm("Sei sicuro di voler eliminare questo team?");
        if (!confirmed) return;

        teamDelete(idTeam)
            .then(() => {
                const teamsListUpdate = teams.filter(team => team.idTeam !== idTeam);
                dispatch(setTeam(teamsListUpdate));
                alert('Team eliminato');
            })
            .catch(err => {
                console.log(err.response?.data?.response);
                alert('Errore nell`eliminazione del team');
            });

        teamMemberDeleteTeam(idTeam).catch(err => {
            console.log(err.response?.data?.response);
            alert('Errore nell`eliminazione dei team members');
        });
    };

    const isUserAdmin = (teamId) => {
        const membersRole = teamsMembersRole[teamId] || [];
        return membersRole.some(mr => mr.idUser === user.idUser && mr.admin);
    };

    return (
        <div>
            <Navbar />
            <header className="bg-gray bg-gradient text-white text-center py-4">
                <h1 className="display-6 mb-4">TEAMS LIST</h1>

                <div className="d-flex justify-content-center">
                    {teams.length > 0 && (
                        <div className="accordion bg-dark text-white w-50" id="accordionExample">
                            {teams.map((team) => (
                                <div className="accordion-item" key={team.idTeam}>
                                    <h2 className="accordion-header">
                                        <button
                                            className="accordion-button bg-dark text-white custom-accordion-button text-center"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse${team.idTeam}`}
                                            aria-expanded="false"
                                            aria-controls={`collapse${team.idTeam}`}
                                        >
                                            {team.name}
                                        </button>
                                    </h2>

                                    <div
                                        id={`collapse${team.idTeam}`}
                                        className="accordion-collapse collapse"
                                        aria-labelledby={`heading${team.idTeam}`}
                                        data-bs-parent={null}
                                    >
                                        <div className="accordion-body custom-accordion-body text-center">
                                            <p><strong>Nome:</strong> {team.name}</p>
                                            <p><strong>Tag:</strong> {team.tag}</p>

                                            <div className="btn-group mt-3" role="group" aria-label="Azioni team">
                                                <button
                                                    className="btn btn-purple btn-sm"
                                                    onClick={() => navigate(TEAM, { state: { idTeam: team.idTeam } })}
                                                >
                                                    Info
                                                </button>

                                                {isUserAdmin(team.idTeam) && (
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => deleteTeam(team.idTeam)}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <br />

                <button
                    className="btn btn-purple btn-sm mt-2 px-4"
                    onClick={() => navigate(TEAM_FORM)}
                >
                    Create team
                </button>

            </header>
        </div>
    );
}

export default Teams;
