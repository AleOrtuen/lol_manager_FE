import { useState } from "react";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { teamCompDelete, teamCompFindTeam } from "../service/teamCompService";
import { COMP, COMP_FORM } from "../utils/routes";
import { useSelector } from "react-redux";
import { teamMemberFindUser } from "../service/teamMemberService";

function TeamComp() {
    const user = useSelector((state) => state.user);
    const location = useLocation();
    const navigate = useNavigate();
    const [comps, setComps] = useState([]);
    const [memberRoles, setMemberRoles] = useState()
    const [isTeamAdmin, setIsTeamAdmin] = useState(false);


    //TROVA TUTTE LE COMP DEL TEAM
    useEffect(() => {
        if (location.state && location.state.idTeam) {
            setComps(null);

            teamCompFindTeam(location.state.idTeam)
                .then((response) => {
                    setComps(response.data.objResponse);
                })
                .catch(error => {
                    console.log(error.response?.data?.response || error);
                });

            teamMemberFindUser(user.idUser)
                .then((response) => {
                    const roles = response.data.objResponse || [];
                    setMemberRoles(roles);


                    const isAdmin = Array.isArray(roles) &&
                        roles.some(mr => mr.idTeam === location.state.idTeam && mr.admin);

                    setIsTeamAdmin(isAdmin);
                })
                .catch(error => {
                    console.log(error.response?.data?.response || error);
                });
        }
    }, [location.state]);


    const compDelete = (idComp) => {
        const confirmed = window.confirm("Sei sicuro di voler eliminare questa comp?");
        if (!confirmed) return;

        teamCompDelete(idComp)
            .then((response) => {
                alert('Comp eliminata');
                setComps((prevComps) => prevComps.filter((comp) => comp.idComp !== idComp));
            })
            .catch(error => {
                console.log(error.response.data.response);
                alert('Errore nell`eliminazione della comp');
            })
    };

    return (
        <div>
            <Navbar />
            <header className="bg-gray bg-gradient text-white">
                <h1 className="display-6">TEAM COMPS</h1>
                <br />
                {location.state !== null ?
                    <>
                        <div className="d-flex justify-content-center">
                            <div className="accordion bg-dark text-white w-50" id="accordionExample">
                                {comps && comps.length > 0 ?
                                    comps.map((comp) => (
                                        <div className="accordion-item" key={comp.idComp}>
                                            <h2 className="accordion-header">
                                                <button
                                                    className="accordion-button bg-dark text-white custom-accordion-button text-center"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target={`#collapse${comp.idComp}`}
                                                    aria-expanded="false"
                                                    aria-controls={`collapse${comp.idComp}`}
                                                >
                                                    {comp.name}
                                                </button>
                                            </h2>
                                            <div
                                                id={`collapse${comp.idComp}`}
                                                className="accordion-collapse collapse"
                                                aria-labelledby={`heading${comp.idComp}`}
                                                data-bs-parent={null}
                                            >
                                                <div className="accordion-body custom-accordion-body text-center">
                                                    {comp.descr}
                                                    <br /><br />
                                                    <div className="btn-group" role="group" aria-label="Basic example">
                                                        <button className="btn btn-secondary btn-sm" onClick={() => navigate(COMP, { state: { comp: comp } })}>
                                                            Info
                                                        </button>
                                                        {isTeamAdmin && (
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => compDelete(comp.idComp)}
                                                            >
                                                                Elimina
                                                            </button>
                                                        )}


                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )) : null
                                }
                            </div>
                        </div>
                        <br /><br />
                        {isTeamAdmin && (
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => navigate(COMP_FORM, { state: { idTeam: location.state.idTeam } })}
                            >
                                Crea Comp
                            </button>
                        )}

                    </>
                    : <p>Nessun team selezionato</p>
                }
            </header>
        </div>
    )

}

export default TeamComp