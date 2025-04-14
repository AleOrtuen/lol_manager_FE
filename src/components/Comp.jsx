// import { useLocation } from "react-router-dom";
// import Navbar from "./Navbar";
// import { useEffect, useState } from "react";
// import { champFindAll } from "../service/championsService";
// import DraggableChampions from "./DraggableChampions";
// import { teamFindChamps } from "../service/teamService";
// import { champRoleFindComp, champRoleSave } from "../service/champRoleService";
// import top from '../img/roles/top.webp';
// import jng from '../img/roles/jng.webp';
// import mid from '../img/roles/mid.webp';
// import adc from '../img/roles/adc.webp';
// import sup from '../img/roles/sup.webp';
// import Champions from "./Champions";

// function Comp() {
//     const location = useLocation();
//     const [champions, setChampions] = useState([]);
//     const [champRoles, setChampRoles] = useState([]);
//     const [filteredChampions, setFilteredChampions] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedChampion, setSelectedChampion] = useState(null);
    
//     const [comp, setComp] = useState({
//         idComp: '',
//         idTeam: '',
//         name: '',
//         descr: ''
//     });

//     const [newChampRole, setNewChampRole] = useState({
//         idComp: comp.idComp,
//         idTeam: comp.idTeam,
//         idChamp: '',
//         role: '',
//         descr: '',
//         powerPick: false
//     });

//     //LISTA RUOLI E IMG
//     const rolesData = [
//         { role: 'top', image: top },
//         { role: 'jng', image: jng },
//         { role: 'mid', image: mid },
//         { role: 'adc', image: adc },
//         { role: 'sup', image: sup }
//     ];

//     const [uniqueChamp,setUniqueChamp] = useState({
//         top: [],
//         jng: [],
//         mid: [],
//         adc: [],
//         sup: []
//     });

//     //POPOLA LE LISTE DEI RUOLI CON NOMI CHAMP UNICI
//     useEffect(() => {
//         if (champRoles && champRoles.length > 0) {
//             const newUniqueChamp = {
//                 top: [],
//                 jng: [],
//                 mid: [],
//                 adc: [],
//                 sup: []
//             };

//             champRoles.forEach((champ) => {
//                 const role = champ.role;
//                 const champName = champ.champion.name;

//                 // Verifica se il champion è già presente nel ruolo
//                 if (role && champName && 
//                     !newUniqueChamp[role].some(existingChamp => existingChamp === champName)) {
//                     newUniqueChamp[role].push(champName);
//                 }
//             });

//             setUniqueChamp(newUniqueChamp);
//         }
        
//     }, [champRoles]);

//     // Fetch all champions
//     useEffect(() => {
//         teamFindChamps(location.state.comp.team.idTeam)
//             .then((response) => {
//                 setChampions(response.data.objResponse);
//                 setFilteredChampions(response.data.objResponse);
//             })
//             .catch((error) => {
//                 console.log(error.response.data.response);
//             });
//         champRoleFindComp(location.state.comp.idComp)
//             .then((response) => {
//                 setChampRoles(response.data.objResponse);
//             })
//             .catch(error => {
//                 console.log(error.response.data.response);
//             })
//     }, []);

//     // Set comp data from location state
//     useEffect(() => {
//         if (location.state && location.state.comp) {
//             const newComp = {
//                 idComp: location.state.comp.idComp,
//                 idTeam: location.state.comp.team.idTeam,
//                 name: location.state.comp.name,
//                 descr: location.state.comp.descr
//             };

//             setComp(newComp);

//             // ✅ Set also newChampRole here since we have the values now
//             setNewChampRole((prev) => ({
//                 ...prev,
//                 idComp: newComp.idComp,
//                 idTeam: newComp.idTeam
//             }));
//         }
//     }, [location.state]);


//     // Filter champions based on search term
//     useEffect(() => {
//         if (searchTerm.trim() === "") {
//             setFilteredChampions(champions);
//         } else {
//             const term = searchTerm.toLowerCase();
//             const filtered = champions.filter(champion =>
//                 (champion.name || "").toLowerCase().includes(term)
//             );
//             setFilteredChampions(filtered);
//         }
//     }, [champions, searchTerm]);

//     const roleSave = () => {
//         const champRole = {
//             champion: {
//                 idChamp: selectedChampion.idChamp
//             },
//             comp: {
//                 idComp: newChampRole.idComp,
//                 team: {
//                     idTeam: newChampRole.idTeam
//                 }
//             },
//             role: newChampRole.role,
//             descr: newChampRole.descr,
//             powerPick: newChampRole.powerPick
//         }

//         champRoleSave(champRole)
//             .then((response) => {
//                 console.log(response.data);
//                 alert('Champion role salvato correttamente');
//             })
//             .catch(error => {
//                 console.log(error.response.data.response);
//                 alert('Error nel salvataggio');
//             })
//     }

//     // Handle search input change
//     const handleSearchChange = (e) => {
//         setSearchTerm(e.target.value);
//     };

//     // Clear search
//     const handleClearSearch = () => {
//         setSearchTerm("");
//     };

//     // Handle champion selection from DraggableChampions
//     const handleChampionSelect = (champion) => {
//         setSelectedChampion(champion);
//         setNewChampRole((prev) => ({
//             ...prev,
//             idChamp: champion.idChamp
//         }));
//     };

//     // Handle clearing the selected champion
//     const handleClearSelection = () => {
//         if (selectedChampion) {
//             setSelectedChampion(null);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setNewChampRole((prevData) => ({
//             ...prevData,
//             [name]: value
//         }));
//     }

//     // METODO PER ATTIVARE IL PULSANTE REGISTRATI CHE RICHIAMA TUTTE LE VALIDAZIONI DEGLI INPUT 
//     const validForm = () => {
//         return validChamp(newChampRole.idChamp)
//             && validRole(newChampRole.role)
//             && validDescr(newChampRole.descr);
//     }

//     // METODI DI VALIDAZIONE DEGLI INPUT 
//     const validChamp = (champ) => {
//         return champ !== '';
//     }
//     const validRole = (role) => {
//         return role !== '';
//     }
//     const validDescr = (descr) => {
//         return descr.length <= 255;
//     }

      
//     return (
//         <div>
//             <Navbar />
//             <header className="bg-gray bg-gradient text-white">
//                 <h1 className="display-6">{comp.name}</h1>
//                 <span>{comp.descr}</span>
//                 <br /><br />
//                 {/* Selected Champion Slot */}
//                 <div className="container">
//                     <div className="row justify-content-center mb-4">
//                         <div
//                             className="col-auto"
//                             style={{
//                                 width: '85px',
//                                 height: '85px',
//                                 border: '2px solid #555',
//                                 display: 'flex',
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 backgroundColor: '#333',
//                                 borderRadius: '8px',
//                                 cursor: 'pointer',
//                                 marginBottom: '20px'
//                             }}
//                             onClick={handleClearSelection}
//                         >
//                             {selectedChampion ? (
//                                 <DraggableChampions
//                                     champions={[selectedChampion]}
//                                     onChampionClick={() => { }} // Empty function as we handle click on the container
//                                 />
//                             ) : (
//                                 <img
//                                     src="../img/champions/champless.png"
//                                     alt="No Champion"
//                                     style={{
//                                         width: '67px',
//                                         height: '67px',
//                                         objectFit: 'cover',
//                                         borderRadius: '8px'
//                                     }}
//                                 />
//                             )}
//                         </div>
//                         {selectedChampion && selectedChampion.name !== null ?
//                             <span>{selectedChampion.name}</span>
//                             : null
//                         }
//                     </div>
//                     <div class="row justify-content-center">
//                         <div className="col-8 col-lg-4 col-md-6 col-sm-6">
//                             <form>
//                                 <div className="form-floating mb-3">
//                                     <select
//                                         className="form-select"
//                                         id="floatingSelect"
//                                         name="role"
//                                         value={newChampRole.role || ''}
//                                         onChange={(e) => handleChange(e)}
//                                         // onKeyDown={handleKey}
//                                         aria-label="Floating label select example"
//                                     >
//                                         <option value="">No Role</option>
//                                         <option value="top">Top</option>
//                                         <option value="jng">Jungle</option>
//                                         <option value="mid">Mid</option>
//                                         <option value="adc">Adc</option>
//                                         <option value="sup">Support</option>
//                                     </select>
//                                     <label htmlFor="floatingSelect">Ruolo</label>
//                                 </div>
//                                 <div className="form-floating mb-3">
//                                     <textarea
//                                         class="form-control"
//                                         type="text"
//                                         id="descr"
//                                         name="descr"
//                                         value={newChampRole.descr}
//                                         placeholder="Descrizione"
//                                         onChange={(e) => handleChange(e)}
//                                     // onKeyDown={handleKey}
//                                     // onBlur={(e) => errorChange(e)}

//                                     />
//                                     <label htmlFor="descr">Descrizione</label>
//                                 </div>
//                                 <div className="form-check mb-3 d-flex align-items-center">
//                                     <input
//                                         className="form-check-input me-2"
//                                         type="checkbox"
//                                         checked={newChampRole.powerPick}
//                                         id="checkChecked"
//                                         onChange={(e) =>
//                                             setNewChampRole((prev) => ({
//                                                 ...prev,
//                                                 powerPick: e.target.checked
//                                             }))
//                                         }
//                                     />
//                                     <label className="form-check-label mb-0" htmlFor="checkChecked">
//                                         Power pick
//                                     </label>
//                                 </div>
//                             </form>
//                             <button
//                                 class="btn btn-outline-secondary btn-md"
//                                 disabled={!validForm()}
//                                 onClick={() => roleSave()}
//                             >
//                                 Salva
//                             </button>
//                         </div>
//                     </div>
//                     {/* Search Bar */}
//                     <div className="container mt-4 mb-3">
//                         <div className="row justify-content-center">
//                             <div className="col-8 col-lg-4 col-md-6 col-sm-6">
//                                 <div className="input-group">
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         placeholder="Cerca un campione..."
//                                         value={searchTerm}
//                                         onChange={handleSearchChange}
//                                     />
//                                     {searchTerm && (
//                                         <button
//                                             className="btn btn-outline-secondary"
//                                             type="button"
//                                             onClick={handleClearSearch}
//                                         >
//                                             ✕
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     {/* Champion Gallery using DraggableChampions */}
//                     <div className="row justify-content-center">
//                         <div className="col-12" style={{ maxHeight: '50vh' }}>
//                             <div className="rounded-top d-flex flex-column h-100" style={{ border: '5px solid #242424' }}>
//                                 <div className="bg-dark text-white text-center p-2">
//                                     Campioni del team
//                                 </div>
//                                 <div className="flex-grow-1 overflow-auto p-2 text-center">
//                                     {filteredChampions && filteredChampions.length > 0 ? (
//                                         <DraggableChampions
//                                             champions={filteredChampions}
//                                             onChampionClick={handleChampionSelect}
//                                         />
//                                     ) : (
//                                         <div className="text-white-50 mt-4">
//                                             {searchTerm ? "No champions found" : "No champions available"}
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="row justify-content-center">
//                         {rolesData.map((roleInfo) => (
//                             <div 
//                                 key={roleInfo.role} 
//                                 className="col p-1" 
//                                 style={{height: '50vh'}}
//                             >
//                                 <div
//                                     className="rounded-top d-flex flex-column h-100"
//                                     style={{
//                                         border: '5px solid #242424',
//                                     }}
//                                 >
//                                     <div className="bg-dark text-white text-center p-2">
//                                         <img 
//                                             src={roleInfo.image} 
//                                             alt={roleInfo.role} 
//                                             className="img-fluid mx-auto"
//                                             style={{
//                                                 maxHeight: '30px', 
//                                                 objectFit: 'contain'
//                                             }}
//                                         />
//                                     </div>
//                                     <div className="flex-grow-1 overflow-auto p-2 text-center"
//                                         style={{
//                                         display: 'flex',
//                                         flexWrap: 'wrap',
//                                         gap: '3px',
//                                         justifyContent: 'center',
//                                         alignContent: 'flex-start'
//                                         }}
//                                     >
//                                         {uniqueChamp[roleInfo.role] && uniqueChamp[roleInfo.role].length > 0 ? (
//                                             uniqueChamp[roleInfo.role].map((champName) => {
//                                                 const champRole = champRoles.find(
//                                                     (champRole) => 
//                                                         champRole.role === roleInfo.role && 
//                                                         champRole.champion.name === champName
//                                                 );

//                                                 return champRole ? (
//                                                     <div key={champName}>
//                                                         <a onClick={() => champClick(champRole.champion)}>
//                                                             <Champions champions={[champRole.champion]} />
//                                                         </a>
//                                                     </div>
//                                                 ) : null;
//                                             })
//                                         ) : null}
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </header>
//         </div>
//     );
// }

// export default Comp;
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { champFindAll } from "../service/championsService";
import DraggableChampions from "./DraggableChampions";
import { teamFindChamps } from "../service/teamService";
import { champRoleFindComp, champRoleSave } from "../service/champRoleService";
import top from '../img/roles/top.webp';
import jng from '../img/roles/jng.webp';
import mid from '../img/roles/mid.webp';
import adc from '../img/roles/adc.webp';
import sup from '../img/roles/sup.webp';
import Champions from "./Champions";

function Comp() {
    const location = useLocation();
    const [champions, setChampions] = useState([]);
    const [champRoles, setChampRoles] = useState([]);
    const [filteredChampions, setFilteredChampions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedChampion, setSelectedChampion] = useState(null);
    const [activeTab, setActiveTab] = useState("all"); // New state for active tab
    const [selectedChampRole, setSelectedChampRole] = useState(null); // For showing champRole details
    
    const [comp, setComp] = useState({
        idComp: '',
        idTeam: '',
        name: '',
        descr: ''
    });

    const [newChampRole, setNewChampRole] = useState({
        idComp: comp.idComp,
        idTeam: comp.idTeam,
        idChamp: '',
        role: '',
        descr: '',
        powerPick: false
    });

    //LISTA RUOLI E IMG
    const rolesData = [
        { role: 'top', image: top },
        { role: 'jng', image: jng },
        { role: 'mid', image: mid },
        { role: 'adc', image: adc },
        { role: 'sup', image: sup }
    ];

    const [uniqueChamp,setUniqueChamp] = useState({
        top: [],
        jng: [],
        mid: [],
        adc: [],
        sup: []
    });

    // Filter champions by selected role tab
    const getDisplayedChampions = () => {
        if (activeTab === "all") {
            return filteredChampions;
        } else {
            // Filter champions by role
            return champRoles
                .filter(champRole => champRole.role === activeTab)
                .map(champRole => champRole.champion);
        }
    };

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

    // Fetch all champions
    useEffect(() => {
        teamFindChamps(location.state.comp.team.idTeam)
            .then((response) => {
                setChampions(response.data.objResponse);
                setFilteredChampions(response.data.objResponse);
            })
            .catch((error) => {
                console.log(error.response.data.response);
            });
        champRoleFindComp(location.state.comp.idComp)
            .then((response) => {
                setChampRoles(response.data.objResponse);
            })
            .catch(error => {
                console.log(error.response.data.response);
            })
    }, []);

    // Set comp data from location state
    useEffect(() => {
        if (location.state && location.state.comp) {
            const newComp = {
                idComp: location.state.comp.idComp,
                idTeam: location.state.comp.team.idTeam,
                name: location.state.comp.name,
                descr: location.state.comp.descr
            };

            setComp(newComp);

            // ✅ Set also newChampRole here since we have the values now
            setNewChampRole((prev) => ({
                ...prev,
                idComp: newComp.idComp,
                idTeam: newComp.idTeam
            }));
        }
    }, [location.state]);


    // Filter champions based on search term
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredChampions(champions);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = champions.filter(champion =>
                (champion.name || "").toLowerCase().includes(term)
            );
            setFilteredChampions(filtered);
        }
    }, [champions, searchTerm]);

    const roleSave = () => {
        const champRole = {
            champion: {
                idChamp: selectedChampion.idChamp
            },
            comp: {
                idComp: newChampRole.idComp,
                team: {
                    idTeam: newChampRole.idTeam
                }
            },
            role: newChampRole.role,
            descr: newChampRole.descr,
            powerPick: newChampRole.powerPick
        }

        champRoleSave(champRole)
            .then((response) => {
                console.log(response.data);
                alert('Champion role salvato correttamente');
                
                // Refresh champion roles data after saving
                champRoleFindComp(comp.idComp)
                    .then((response) => {
                        setChampRoles(response.data.objResponse);
                    })
                    .catch(error => {
                        console.log(error.response.data.response);
                    });
            })
            .catch(error => {
                console.log(error.response.data.response);
                alert('Error nel salvataggio');
            })
    }

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchTerm("");
    };

    // Handle champion selection from DraggableChampions
    const handleChampionSelect = (champion) => {
        setSelectedChampion(champion);
        setNewChampRole((prev) => ({
            ...prev,
            idChamp: champion.idChamp
        }));
        
        // Clear selected champRole when selecting a new champion
        setSelectedChampRole(null);
    };

    // Handle clearing the selected champion
    const handleClearSelection = () => {
        if (selectedChampion) {
            setSelectedChampion(null);
            setSelectedChampRole(null);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewChampRole((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    // Change active tab
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Handle champion click from role sections
    const champClick = (champion) => {
        // Find the champRole associated with this champion in the given role
        const foundChampRole = champRoles.find(
            cr => cr.champion.idChamp === champion.idChamp && cr.role === activeTab
        );
        
        setSelectedChampion(champion);
        setNewChampRole((prev) => ({
            ...prev,
            idChamp: champion.idChamp
        }));
        
        // Set the selectedChampRole for displaying details
        if (foundChampRole) {
            setSelectedChampRole(foundChampRole);
            
            // Also update the form with this champRole's data
            setNewChampRole((prev) => ({
                ...prev,
                role: foundChampRole.role,
                descr: foundChampRole.descr,
                powerPick: foundChampRole.powerPick
            }));
        }
    };

    // METODO PER ATTIVARE IL PULSANTE REGISTRATI CHE RICHIAMA TUTTE LE VALIDAZIONI DEGLI INPUT 
    const validForm = () => {
        return validChamp(newChampRole.idChamp)
            && validRole(newChampRole.role)
            && validDescr(newChampRole.descr);
    }

    // METODI DI VALIDAZIONE DEGLI INPUT 
    const validChamp = (champ) => {
        return champ !== '';
    }
    const validRole = (role) => {
        return role !== '';
    }
    const validDescr = (descr) => {
        return descr.length <= 255;
    }

    // Helper function to get role name for display
    const getRoleName = (roleCode) => {
        switch(roleCode) {
            case 'top': return 'Top';
            case 'jng': return 'Jungle';
            case 'mid': return 'Mid';
            case 'adc': return 'ADC';
            case 'sup': return 'Support';
            default: return roleCode;
        }
    };
      
    return (
        <div>
            <Navbar />
            <header className="bg-gray bg-gradient text-white">
                <h1 className="display-6">{comp.name}</h1>
                <span>{comp.descr}</span>
                <br /><br />
                {/* Selected Champion Slot and ChampRole Info */}
                <div className="container">
                    <div className="row justify-content-center mb-4">
                        <div className="col-auto d-flex flex-column align-items-center">
                            <div
                                style={{
                                    width: '85px',
                                    height: '85px',
                                    border: '2px solid #555',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#333',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    marginBottom: '10px'
                                }}
                                onClick={handleClearSelection}
                            >
                                {selectedChampion ? (
                                    <DraggableChampions
                                        champions={[selectedChampion]}
                                        onChampionClick={() => { }}
                                    />
                                ) : (
                                    <img
                                        src="../img/champions/champless.png"
                                        alt="No Champion"
                                        style={{
                                            width: '67px',
                                            height: '67px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
                                )}
                            </div>
                            {selectedChampion && selectedChampion.name !== null ?
                                <span>{selectedChampion.name}</span>
                                : null
                            }
                        </div>
                        
                        {/* ChampRole Info Section */}
                        {selectedChampRole && (
                            <div className="col-auto ms-4 p-3" style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                                <h5>ChampRole Details</h5>
                                <div className="d-flex flex-column">
                                    <div className="mb-1">
                                        <strong>Champion:</strong> {selectedChampRole.champion.name}
                                    </div>
                                    <div className="mb-1">
                                        <strong>Role:</strong> {getRoleName(selectedChampRole.role)}
                                    </div>
                                    <div className="mb-1">
                                        <strong>Description:</strong> {selectedChampRole.descr || 'No description'}
                                    </div>
                                    <div>
                                        <strong>Power Pick:</strong> {selectedChampRole.powerPick ? 'Yes' : 'No'}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-8 col-lg-4 col-md-6 col-sm-6">
                            <form>
                                <div className="form-floating mb-3">
                                    <select
                                        className="form-select"
                                        id="floatingSelect"
                                        name="role"
                                        value={newChampRole.role || ''}
                                        onChange={(e) => handleChange(e)}
                                        aria-label="Floating label select example"
                                    >
                                        <option value="">No Role</option>
                                        <option value="top">Top</option>
                                        <option value="jng">Jungle</option>
                                        <option value="mid">Mid</option>
                                        <option value="adc">Adc</option>
                                        <option value="sup">Support</option>
                                    </select>
                                    <label htmlFor="floatingSelect">Ruolo</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <textarea
                                        className="form-control"
                                        type="text"
                                        id="descr"
                                        name="descr"
                                        value={newChampRole.descr}
                                        placeholder="Descrizione"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <label htmlFor="descr">Descrizione</label>
                                </div>
                                <div className="form-check mb-3 d-flex align-items-center">
                                    <input
                                        className="form-check-input me-2"
                                        type="checkbox"
                                        checked={newChampRole.powerPick}
                                        id="checkChecked"
                                        onChange={(e) =>
                                            setNewChampRole((prev) => ({
                                                ...prev,
                                                powerPick: e.target.checked
                                            }))
                                        }
                                    />
                                    <label className="form-check-label mb-0" htmlFor="checkChecked">
                                        Power pick
                                    </label>
                                </div>
                            </form>
                            <button
                                className="btn btn-outline-secondary btn-md"
                                disabled={!validForm()}
                                onClick={() => roleSave()}
                            >
                                Salva
                            </button>
                        </div>
                    </div>
                    {/* Search Bar */}
                    <div className="container mt-4 mb-3">
                        <div className="row justify-content-center">
                            <div className="col-8 col-lg-4 col-md-6 col-sm-6">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Cerca un campione..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                    {searchTerm && (
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={handleClearSearch}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Tabbed Champion Gallery with Right-aligned Tabs */}
                    <div className="row justify-content-center">
                        <div className="col-12" style={{ maxHeight: '50vh' }}>
                            <div className="rounded-top d-flex flex-column h-100" style={{ border: '5px solid #242424' }}>
                                {/* Tab Navigation - Now right-aligned */}
                                <div className="bg-dark d-flex justify-content-end">
                                    <div 
                                        className={`tab-item py-2 px-3 text-center ${activeTab === 'all' ? 'bg-primary' : ''}`}
                                        onClick={() => handleTabChange('all')}
                                        style={{ 
                                            cursor: 'pointer', 
                                            minWidth: '50px',
                                            borderLeft: '1px solid #333'
                                        }}
                                    >
                                        <span className="text-white">ALL</span>
                                    </div>
                                    
                                    {rolesData.map((roleInfo) => (
                                        <div 
                                            key={roleInfo.role}
                                            className={`tab-item py-2 px-3 text-center ${activeTab === roleInfo.role ? 'bg-primary' : ''}`}
                                            onClick={() => handleTabChange(roleInfo.role)}
                                            style={{ 
                                                cursor: 'pointer', 
                                                minWidth: '50px',
                                                borderLeft: '1px solid #333'
                                            }}
                                        >
                                            <img 
                                                src={roleInfo.image} 
                                                alt={roleInfo.role} 
                                                className="img-fluid mx-auto"
                                                style={{
                                                    maxHeight: '20px', 
                                                    objectFit: 'contain'
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Tab Content */}
                                <div className="flex-grow-1 overflow-auto p-2 text-center">
                                    {getDisplayedChampions().length > 0 ? (
                                        <DraggableChampions
                                            champions={getDisplayedChampions()}
                                            onChampionClick={handleChampionSelect}
                                        />
                                    ) : (
                                        <div className="text-white-50 mt-4">
                                            {searchTerm ? "No champions found" : `No champions available ${activeTab !== 'all' ? `for ${activeTab} role` : ''}`}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Role-specific champion layouts */}
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

export default Comp;