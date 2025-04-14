import { useEffect, useState } from "react"
import Navbar from "./Navbar"
import { teamDelete, teamFindAll } from "../service/teamService";
import { TEAM } from "../utils/routes";
import { useNavigate } from "react-router-dom";

function Teams() {

    const [teams,setTeams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        teamFindAll()
            .then((response) => {
                console.log(response.data);
                setTeams(response.data.objResponse);
            })
            .catch(error => {
                console.log(error.response.data.response);
            })
    }, []);

    const deleteTeam = (idTeam) => {
        const confirmed = window.confirm("Sei sicuro di voler eliminare questo team?");
        if (!confirmed) return;
    
        teamDelete(idTeam)
            .then((response) => {
                console.log(response.data);
                alert('Team eliminato');
                // Aggiorna la lista senza ricaricare la pagina
                setTeams((prevTeams) => prevTeams.filter((team) => team.idTeam !== idTeam));
            })
            .catch(error => {
                console.log(error.response.data.response);
                alert('Errore nell`eliminazione del team');
            });
    };

    return (
        <div>
            <Navbar />
            <header className="bg-gray bg-gradient text-white">
                <h1 className="display-6">LISTA TEAMS</h1>
                <br />
                <div className="d-flex justify-content-center">
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
                                        {team.name}
                                        <br/>
                                        {team.tag}
                                        <br /><br />
                                        <div class="btn-group" role="group" aria-label="Basic example">
                                            <button class="btn btn-secondary btn-sm" onClick={() => navigate(TEAM, { state: { idTeam: team.idTeam } })}>
                                                Info
                                            </button>
                                            <button class="btn btn-danger btn-sm" onClick={() => deleteTeam(team.idTeam)}>
                                                Elimina
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> 
            </header>
        </div>
    )
}

export default Teams