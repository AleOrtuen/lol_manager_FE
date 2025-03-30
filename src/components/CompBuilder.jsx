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
import { teamCombinator } from '../service/teamService';
import ChampionBox from './ChampionBox';


function CompBuilder() {
    const location = useLocation();
    const [comps,setComps] = useState([]);
    const [champRoles,setChampRoles] = useState([]);
    const [champPicked,setChampPicked] = useState([]);
    const [uniqueChamp,setUniqueChamp] = useState({
        top: [],
        jng: [],
        mid: [],
        adc: [],
        sup: []
    });

    const [pick,setPick] = useState({
        1: {
            champion: null,
            locked: false
        },
        2: {
            champion: null,
            locked: false
        },
        3: {
            champion: null,
            locked: false
        },
        4: {
            champion: null,
            locked: false
        },
        5: {
            champion: null,
            locked: false
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

    //LISTA RUOLI E IMG
    const rolesData = [
        { role: 'top', image: top },
        { role: 'jng', image: jng },
        { role: 'mid', image: mid },
        { role: 'adc', image: adc },
        { role: 'sup', image: sup }
    ];
     
    //METODO DI SELEZIONE CHAMP
    const champClick = (champ) => {
        // Create a copy of the current pick state
        const updatedPick = {...pick};
        
        // Find the first unlocked or matching slot
        for (let pickNumber in updatedPick) {
            // Check two conditions:
            // 1. Slot is empty OR slot has an unlocked champion
            // 2. All previous slots are locked (or this is the first slot)
            const previousSlotsClosed = Object.keys(updatedPick)
                .filter(key => parseInt(key) < parseInt(pickNumber))
                .every(key => updatedPick[key].locked || updatedPick[key].champion === null);
    
            if (
                (updatedPick[pickNumber].champion === null || !updatedPick[pickNumber].locked) && 
                previousSlotsClosed
            ) {
                updatedPick[pickNumber].champion = champ;
                setPick(updatedPick);
                break;
            }
        }
    }

    //METODO DI LOCK
    const lockChampions = () => {
        pickCombinator();
        const updatedPick = {...pick};
        
        // Lock the first non-locked champion
        for (let pickNumber in updatedPick) {
            if (
                updatedPick[pickNumber].champion !== null && 
                !updatedPick[pickNumber].locked
            ) {
                updatedPick[pickNumber].locked = true;
                setPick(updatedPick);
                break;
            }
        }
    }

    const pickCombinator = () => {

        let newPick = null;
        let oldPicks = [];

        const newChampRoles = [...champRoles, ...champPicked];

        let oldList = [];
        let newList = [];

        //TROVA LA NUOVA PICK SELEZIONATA E LA INSERISCE IN NEWPICK
        for (let nonLocked in pick) {
            if (pick[nonLocked].champion !== null &&
                !pick[nonLocked].locked
            ) {
                newPick = pick[nonLocked].champion;
                break;
            }
        }

        //TROVA TUTTI I CHAMP LOCKATI E LI INSERISCE IN OLDPICKS
        for (let locked in pick) {
            if (pick[locked].champion !== null &&
                pick[locked].locked
            ) {
                oldPicks.push(pick[locked].champion);
            }
        }

        //INSERISCE IN NEWLIST TUTTI I CHAMPROLE DELLA NUOVA PICK
        for (const role of newChampRoles) {
            if (newPick.idChamp === role.champion.idChamp) {
                newList.push(role);
            }
        }

        //INSERISCE IN OLDLIST TUTTI I CHAMPROLE DEI CHAMP PICKATI IN PRECEDENZA
        for (let oldPickChamp of oldPicks) {
            for (const role of newChampRoles) {
                if (oldPickChamp.idChamp === role.champion.idChamp) {
                    oldList.push(role);
                }
            }
        }

        const request = {
            oldList,
            newList
        } 

        if (request && request !== null) {
            teamCombinator(request)
                .then ( (response) => {
                    setChampRoles(response.data.objResponse2);
                    setChampPicked(response.data.objResponse);
                })
                .catch( error => {
                    console.log(error.response.data.response);
                })
        }

    }
    
    

    return (
        <div>
            <Navbar />
            <header className="bg-gray bg-gradient text-white">
                <h1 className="display-6">Comp combinator</h1>
                <br/>
                <div className="row mb-3 justify-content-center">
                {Object.keys(pick).map((pickNumber) => (
                    // <div 
                    //     key={pickNumber} 
                    //     className="col-2 m-1" 
                    //     style={{
                    //         width: '85px', 
                    //         height: '85px', 
                    //         border: `2px solid ${pick[pickNumber].locked ? 'green' : '#555'}`,
                    //         display: 'flex',
                    //         justifyContent: 'center',
                    //         alignItems: 'center',
                    //         backgroundColor: '#333',
                    //         borderRadius: '8px'
                    //     }}
                    // >
                    //     <span className="text-secondary">
                    //         {pick[pickNumber].champion ? 
                    //             <Champions champions={[pick[pickNumber].champion]} /> : 
                    //             "No Champion"}
                    //     </span>
                    // </div>
//                     <ChampionBox 
//     key={pickNumber}
//     pickNumber={pickNumber} 
//     pick={pick} 
//     Champions={Champions} 
// />
<ChampionBox 
key={pickNumber}
pickNumber={pickNumber} 
pick={pick} 
Champions={Champions}
champRoles={champRoles}
champPicked={champPicked}
/>
                ))}
                </div>
                <button 
                    className="btn btn-outline-secondary btn-md" 
                    onClick={lockChampions}
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
                                                        <a onClick={() => champClick(champRole.champion)}>
                                                            <Champions champions={[champRole.champion]} />
                                                        </a>
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