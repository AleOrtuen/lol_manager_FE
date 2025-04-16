import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import DraggableChampions from "./DraggableChampions";
import { teamFindChamps } from "../service/teamService";
import { champRoleDelete, champRoleFindComp, champRoleSave, champRoleUpdate } from "../service/champRoleService";
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

    // Filter champions by selected role tab
    const getDisplayedChampions = () => {
        if (activeTab === "all") {
            return filteredChampions;
        } else {
            // Filter champions by role - get unique champions for this role
            const championsForRole = champRoles
                .filter(champRole => champRole.role === activeTab)
                .map(champRole => champRole.champion);

            // Return array of unique champions for this role
            return Array.from(new Map(championsForRole.map(item => [item.idChamp, item])).values());
        }
    };

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

        if (selectedChampRole === null) {
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
        } else {
            champRoleUpdate(champRole)
                .then((response) => {
                    console.log(response.data);
                    alert('Champion role aggiornato');

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
                })
        }

    }

    const roleDelete = () => {
        const confirmed = window.confirm("Sei sicuro di voler eliminare questo ruolo?");
        if (!confirmed) return;
    
        const idComp = selectedChampRole.comp.idComp;
        const idChamp = selectedChampRole.champion.idChamp;
        const role = selectedChampRole.role;
    
        champRoleDelete(idComp, idChamp, role)
            .then((response) => {
                alert('Champ role eliminato');
                console.log(response.data);
                setChampRoles((prevRoles) =>
                    prevRoles.filter(
                        (r) =>
                            !(
                                r.comp.idComp === idComp &&
                                r.champion.idChamp === idChamp &&
                                r.role === role
                            )
                    )
                );
            })
            .catch((error) => {
                console.log(error.response?.data?.response || error.message);
                alert('Errore eliminazione');
            });
    };
    

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchTerm("");
    };

    // Handle champion selection - now unified for both regular champion selection and champRole details
    const handleChampionSelect = (champion) => {
        setSelectedChampion(champion);
        setNewChampRole((prev) => ({
            ...prev,
            idChamp: champion.idChamp
        }));

        // Check if we're on a role tab and try to find champRole details
        if (activeTab !== 'all') {
            const foundChampRole = champRoles.find(
                cr => cr.champion.idChamp === champion.idChamp && cr.role === activeTab
            );

            if (foundChampRole) {
                setSelectedChampRole(foundChampRole);
                // Update the form with this champRole's data
                setNewChampRole((prev) => ({
                    ...prev,
                    role: foundChampRole.role,
                    descr: foundChampRole.descr || '',
                    powerPick: foundChampRole.powerPick
                }));
            } else {
                setSelectedChampRole(null);
                // Pre-select the current tab's role in the form
                setNewChampRole((prev) => ({
                    ...prev,
                    role: activeTab,
                    descr: '',
                    powerPick: false
                }));
            }
        } else {
            // Clear champRole details when in 'all' tab
            setSelectedChampRole(null);
        }
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

    function handleKey(e) {
        if (e.key === "Enter") {
            roleSave();
        }
    }

    // Change active tab
    const handleTabChange = (tab) => {
        setActiveTab(tab);

        // Clear selection when changing tabs
        setSelectedChampion(null);
        setSelectedChampRole(null);
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
        switch (roleCode) {
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
                    <div className="row justify-content-center">

                        {/* ChampRole Info Section */}
                        <div className="col-3 col-lg-2 col-md-3 col-sm-3 p-1 d-flex flex-column align-items-center" style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                            <div>
                                <span>
                                    {selectedChampion && selectedChampion.name !== null
                                        ? selectedChampion.name
                                        : "\u00A0"}
                                </span>
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
                            </div>
                            {selectedChampRole && (
                                <>

                                    <div className="d-flex flex-column">
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
                                </>
                            )}
                        </div>
                        <div className="col-8 col-lg-4 col-md-6 col-sm-6">
                            <form>
                                <div className="form-floating mb-3">
                                    <select
                                        className="form-select"
                                        id="floatingSelect"
                                        name="role"
                                        value={newChampRole.role || ''}
                                        onChange={(e) => handleChange(e)}
                                        onKeyDown={handleKey}
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
                                        onKeyDown={handleKey}
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
                                        onKeyDown={handleKey}
                                    />
                                    <label className="form-check-label mb-0" htmlFor="checkChecked">
                                        Power pick
                                    </label>

                                </div>
                            </form>
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button
                                    class="btn btn-secondary btn-sm"
                                    disabled={!validForm()}
                                    onClick={() => roleSave()}
                                >
                                    Salva
                                </button>
                                <button
                                    class="btn btn-danger btn-sm"
                                    onClick={() => roleDelete()}
                                >
                                    Elimina
                                </button>
                            </div>
                        </div>
                    </div>
                    <br /><br />
                    {/* Unified Tabbed Champion Gallery with improved functionality */}
                    <div className="row justify-content-center">
                        <div className="col-12" style={{ height: '70vh' }}>
                            <div
                                className="rounded-top d-flex flex-column"
                                style={{
                                    border: '5px solid #242424',
                                    maxHeight: '50vh'
                                }}>

                                {/* Tab Navigation - Right-aligned */}
                                <div className="bg-dark d-flex ">

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

                                    <div className="ms-auto px-2" style={{ maxWidth: '250px' }}>
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

                                {/* Enhanced Tab Content */}
                                <div className="flex-grow-1 overflow-auto p-2 text-center">
                                    {getDisplayedChampions().length > 0 ? (
                                        activeTab === 'all' ? (
                                            <DraggableChampions
                                                champions={getDisplayedChampions()}
                                                onChampionClick={handleChampionSelect}
                                            />
                                        ) : (
                                            <div className="d-flex flex-wrap justify-content-center gap-2">
                                                {getDisplayedChampions().map(champion => (
                                                    <div key={champion.idChamp} className="p-1" onClick={() => handleChampionSelect(champion)}>
                                                        <Champions champions={[champion]} />
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-white-50 mt-4">
                                            {searchTerm ? "No champions found" : `No champions available ${activeTab !== 'all' ? `for ${activeTab} role` : ''}`}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default Comp;