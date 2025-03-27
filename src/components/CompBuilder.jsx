import { useEffect, useState } from 'react';
import Navbar from "./Navbar";
import top from '../img/roles/top.webp';
import jng from '../img/roles/jng.webp';
import mid from '../img/roles/mid.webp';
import adc from '../img/roles/adc.webp';
import sup from '../img/roles/sup.webp';
import { useLocation } from 'react-router-dom';
import { teamCompFindTeam } from '../service/teamCompService';
import { champRoleFindComp } from '../service/champRoleService';
import Champions from './Champions';


function CompBuilder() {
    const location = useLocation();
    const [comps,setComps] = useState([]);
    const [champRoles,setChampRoles] = useState([]);
    const [uniqueChamp,setUniqueChamp] = useState({
        top: [],
        jng: [],
        mid: [],
        adc: [],
        sup: []
    });

    const [pick,setPick] = useState({
        1: {
            champion: "ciaone"
        },
        2: {
            champion: null
        },
        3: {
            champion: null
        },
        4: {
            champion: null
        },
        5: {
            champion: null
        }
    })

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

    //TROVA TUTTI I CHAMP ROLE PER LE COMP
    useEffect(() => {
        if (comps && comps.length > 0) {
            comps.forEach( (comp) => { 
                champRoleFindComp(comp.idComp)
                    .then((response) => {
                        setChampRoles(prevChampRoles => [
                            ...prevChampRoles,  
                            ...response.data.objResponse 
                        ]);
                    })
                    .catch(error => {
                        console.log(error.response.data);
                    });
            });
        }
    }, [comps]);
    
    //POPOLA LE LISTE DEI RUOLI CON NOMI CHAMP UNICI
    useEffect(() => {
        if (champRoles && champRoles.length > 0) {
            const newUniqueChamp = {
                top: [],
                jng: [],
                mid: [],
                adc: [],
                sup: []
            };

            champRoles.forEach((champ) => {
                const role = champ.role;
                const champName = champ.champion.name;

                // Verifica se il champion è già presente nel ruolo
                if (role && champName && 
                    !newUniqueChamp[role].some(existingChamp => existingChamp === champName)) {
                    newUniqueChamp[role].push(champName);
                }
            });

            setUniqueChamp(newUniqueChamp);
        }
    }, [champRoles]);

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
                <h2>Comp combinator</h2>
                <br/>
                <div className="row mb-3 justify-content-center">
                {Object.keys(pick).map((pickNumber) => (
                    <div 
                        key={pickNumber} 
                        className="col-2 m-1" 
                        style={{
                            width: '75px', 
                            height: '75px', 
                            border: '2px solid #555',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#333',
                            borderRadius: '8px'
                        }}
                    >
                        <span className="text-muted">
                            {pick[pickNumber].champion ? pick[pickNumber].champion : "No Champion"}
                        </span>
                    </div>
                ))}
                </div>
                <button 
                    class="btn btn-outline-secondary btn-md" 
                    // onClick={() => userRegistration()}
                >
                    Lock 
                </button>
                <br/><br/>
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        {rolesData.map((roleInfo) => (
                            <div 
                                key={roleInfo.role} 
                                className="col p-1" 
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
                                    <div className="flex-grow-1 overflow-auto p-2 text-center"
                                        style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '3px',
                                        justifyContent: 'center',
                                        alignContent: 'flex-start'
                                        }}
                                    >
                                        {uniqueChamp[roleInfo.role] && uniqueChamp[roleInfo.role].length > 0 ? (
                                            uniqueChamp[roleInfo.role].map((champName) => {
                                                const champRole = champRoles.find(
                                                    (champRole) => 
                                                        champRole.role === roleInfo.role && 
                                                        champRole.champion.name === champName
                                                );

                                                return champRole ? (
                                                    <div key={champName}>
                                                        <Champions champions={[champRole.champion]} />
                                                    </div>
                                                ) : null;
                                            })
                                        ) : null}
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