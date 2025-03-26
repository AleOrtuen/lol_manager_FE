import { useEffect, useState } from 'react';
import Navbar from "./Navbar";
import top from '../img/roles/top.webp';
import jng from '../img/roles/jng.webp';
import mid from '../img/roles/mid.webp';
import adc from '../img/roles/adc.webp';
import sup from '../img/roles/sup.webp';
import { useLocation } from 'react-router-dom';
import { teamCompFindTeam } from '../service/teamCompService';


function CompBuilder() {
    const location = useLocation();
    const [comps,setComps] = useState([]);
    const [champRoles,setChampRoles] = useState([]);

    useEffect(() => {
        console.log(location && location.state.idTeam)
        if (location.state && location.state.idTeam) {
            teamCompFindTeam(location.state.idTeam).then ( (response) => {
                setComps(response.data.objResponse);
                console.log(comps);
            }).catch( error => {
                console.log(error.response.data.response)
            })

        }

    }, []);

    // useEffect(() => {
    //     if (comps & comps.length > 0) {

    //     }
    // }, [comps])

    const rolesData = [
        { role: 'top', image: top },
        { role: 'jng', image: jng },
        { role: 'mid', image: mid },
        { role: 'adc', image: adc },
        { role: 'sup', image: sup }
    ];
     
    return (
        <div>
            <Navbar />
            <header className="bg-gray bg-gradient text-white">
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        {rolesData.map((roleInfo) => (
                            <div 
                                key={roleInfo.role} 
                                className="col p-2" 
                                style={{height: '50vh'}}
                            >
                                <div
                                    className="rounded-top d-flex flex-column h-100"
                                    style={{
                                        border: '5px solid #242424',
                                    }}
                                >
                                    <div className="bg-dark text-white text-center p-2">
                                        <img 
                                            src={roleInfo.image} 
                                            alt={roleInfo.role} 
                                            className="img-fluid mx-auto"
                                            style={{
                                                maxHeight: '30px', 
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </div>
                                    <div className="flex-grow-1 overflow-auto p-2 text-center">
                                        {/* <p>Campioni {roleInfo.role}</p> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </header>
        </div>
    );
}

export default CompBuilder;