import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { teamFindChamps, teamFindMembers } from "../service/teamService";
import Champions from "./Champions";
import topIco from '../img/roles/top_ico.png';
import jngIco from '../img/roles/jng_ico.png';
import midIco from '../img/roles/mid_ico.png';
import adcIco from '../img/roles/adc_ico.png';
import supIco from '../img/roles/sup_ico.png';

function Team() {

    const user = useSelector((state) => state.user);
    const teams = useSelector((state) => state.team);
    const [champs,setChamps] = useState();
    const [members,setMembers] = useState();
    const location = useLocation();

    //LISTA RUOLI E IMG
    const rolesData = [
        { role: 'top', image: topIco },
        { role: 'jng', image: jngIco },
        { role: 'mid', image: midIco },
        { role: 'adc', image: adcIco },
        { role: 'sup', image: supIco }
    ];    

    // useEffect(() => {
    //     if (location.state && location.state.idTeam) {
    //         teamFindChamps(location.state.idTeam).then ( (response) => {
    //             setChamps(response.data.objResponse);  
    //         }).catch( error => {
    //             console.log(error.response.data.response)
    //         }) 

    //         teamFindMembers(location.state.idTeam)
    //             .then ( (response) => {
    //                 setMembers(response.data.objResponse);
    //             })
    //             .catch( error => {
    //                 console.log(error.response.data.response);
    //             })
    //     }

    // }, []);

    useEffect(() => {
        if (location.state && location.state.idTeam) {
            teamFindChamps(location.state.idTeam).then((response) => {
                setChamps(response.data.objResponse);
            }).catch(error => {
                console.log('Error fetching champions:', error.response?.data?.response || error.message);
            });
    
            teamFindMembers(location.state.idTeam)
                .then((response) => {
                    console.log('Members data:', response.data.objResponse);  // Log dei membri
                    setMembers(response.data.objResponse);
                })
                .catch(error => {
                    console.log('Error fetching members:', error.response?.data?.response || error.message);
                });
        }
    }, [location.state]);

    return (
        <div>
            <Navbar />
            <header className="bg-gray bg-gradient text-white">
                {teams.map((team) => (
                    team.idTeam === location.state.idTeam ? (
                        <>
                            <h1 className="display-6">{team.name}</h1>
                            <p>{team.tag}</p>
                        </>
                    ) : null
                ))}
                <br />
                <div>
                {rolesData.map((role) => (
                    <div key={role.role}>
                        <img
                            src={role.image}
                            style={{
                                width: '20px',
                                height: '20px',
                                maxWidth: '20px',
                                maxHeight: '20px',
                                marginRight: '5px',
                            }}
                            alt="Role icon"
                        />
                        {members && members.length > 0 ? (
                            members.map((member) => (
                                member.pRole === role.role ? (
                                    <span key={member.id}>{member.username}</span>
                                ) : null
                            ))
                        ) : (
                            <span>No members found for {role.role}</span>
                        )}
                        <br />
                    </div>
                ))}
                </div>
                <br/>
                <p>Champion pool</p>
                {champs && champs.length > 0 ? (
                    <Champions champions={champs} />
                ) : null}
            </header>
        </div>
    );
    
}

export default Team;