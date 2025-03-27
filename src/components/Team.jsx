import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { teamFindChamps } from "../service/teamService";
import Champions from "./Champions";

function Team() {

    const user = useSelector((state) => state.user);
    const teams = useSelector((state) => state.team);
    const [champs,setChamps] = useState();
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.idTeam) {
            teamFindChamps(location.state.idTeam).then ( (response) => {
                setChamps(response.data.objResponse);  
            }).catch( error => {
                console.log(error.response.data.response)
            }) 
        }
    }, []);

    return(
        <div>
            <Navbar />
            <header className="bg-gray bg-gradient text-white">
                <h3>Champion Pool</h3>
                <br/>
            {champs && champs.length > 0 ?
            <Champions champions={champs} />
            : null
            }
            </header>
        </div>
    )
}

export default Team;