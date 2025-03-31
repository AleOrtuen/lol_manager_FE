import { useState } from "react";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { teamCompFindTeam } from "../service/teamCompService";

function TeamComp() {
    const location = useLocation();
    const [comps,setComps] = useState([]);

    //TROVA TUTTE LE COMP DEL TEAM
    useEffect(() => {
        console.log(location && location.state.idTeam)
        if (location.state && location.state.idTeam) {
            teamCompFindTeam(location.state.idTeam)
                .then ( (response) => {
                    setComps(response.data.objResponse);
                })
                .catch( error => {
                    console.log(error.response.data.response)
                })
        }
    }, []);

    return (
        <div>
            <Navbar />
            <header className="bg-gray bg-gradient text-white">
                <h1 className="display-6">TEAM COMPS</h1>
                <br/>
                <div className="d-flex justify-content-center">
        <div className="accordion bg-dark text-white w-50" id="accordionExample">
            {comps.map((comp) => (
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
                        <br/><br/>
                        <div class="btn-group" role="group" aria-label="Basic example">
                            <button class="btn btn-secondary btn-sm" onClick={() => navigate()}>
                                Info
                            </button>
                            <button class="btn btn-danger btn-sm" onClick={() => navigate()}>
                                Elimina
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            ))}
        </div>
    </div>
    <br/><br/>
    <button class="btn btn-secondary btn-sm" onClick={() => navigate()}>
                                Crea Comp
    </button>
            </header>
        </div>
    )

}

export default TeamComp