import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./Navbar";
import DraggableChampions from "./DraggableChampions";
import { champFindAll } from "../service/championsService";
import { champPoolDelete, champPoolSave } from "../service/champPoolService";
import { userFindById } from "../service/userService";
import { setUser, resetUser } from "../store/slice/userSlice";

function ChampionPool() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [champions, setChampions] = useState([]);
    const [filteredChampions, setFilteredChampions] = useState([]);
    const [pickedChamps, setPickedChamps] = useState(user.champions);

    // Stati per la ricerca
    const [searchTerm, setSearchTerm] = useState("");
    const [displayedFilteredChamps, setDisplayedFilteredChamps] = useState([]);
    const [displayedPickedChamps, setDisplayedPickedChamps] = useState([]);

    useEffect(() => {
        champFindAll()
            .then((response) => {
                setChampions(response.data.objResponse);
            })
            .catch((error) => {
                console.log(error.response.data.response);
            });
    }, []);

    useEffect(() => {
        if (champions.length > 0) {
            let filtered;

            if (pickedChamps.length > 0) {
                filtered = champions.filter((champion) =>
                    !pickedChamps.some((picked) =>
                        picked.idChamp === champion.idChamp
                    )
                );
            } else {
                filtered = [...champions];
            }

            setFilteredChampions(filtered);
        }
    }, [champions, pickedChamps]);

    // Aggiorna liste visualizzate quando filteredChampions o searchTerm cambiano
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setDisplayedFilteredChamps(filteredChampions);
            setDisplayedPickedChamps(pickedChamps);
        } else {
            const term = searchTerm.toLowerCase();

            // Filtra i campioni disponibili
            const matchedFiltered = filteredChampions.filter(champion =>
                (champion.name || champion.nameChamp || "").toLowerCase().includes(term)
            );

            // Filtra i campioni selezionati
            const matchedPicked = pickedChamps.filter(champion =>
                (champion.name || champion.nameChamp || "").toLowerCase().includes(term)
            );

            setDisplayedFilteredChamps(matchedFiltered);
            setDisplayedPickedChamps(matchedPicked);
        }
    }, [filteredChampions, pickedChamps, searchTerm]);

    const handleAddChampion = (champion) => {
        setPickedChamps([...pickedChamps, champion]);

        setFilteredChampions(filteredChampions.filter(
            (champ) => champ.idChamp !== champion.idChamp
        ));
    };

    const handleRemoveChampion = (champion) => {
        setPickedChamps(pickedChamps.filter(
            (champ) => champ.idChamp !== champion.idChamp
        ));

        setFilteredChampions([...filteredChampions, champion]);
    };

    const updateChampPool = async () => {
        let toDelete = [];
        let toSave = [];

        if (pickedChamps.length > 0) {
            toDelete = user.champions.filter((champion) =>
                !pickedChamps.some((picked) =>
                    picked.idChamp === champion.idChamp
                )
            );
        } else {
            toDelete = [...user.champions];
        }

        if (pickedChamps.length > 0) {
            toSave = pickedChamps.filter((picked) =>
                !user.champions.some((champion) =>
                    picked.idChamp === champion.idChamp
                )
            );
        }

        if (toDelete.length > 0) {
            for (const element of toDelete) {
                await champPoolDelete(user.idUser, element.idChamp)
                    .then((response) => {
                    })
                    .catch(error => {
                        console.log(error.response.data.response);
                    })
            }
        }

        if (toSave.length > 0) {
            for (const element of toSave) {
                const champPool = {
                    user: {
                        idUser: user.idUser
                    },
                    champion: {
                        idChamp: element.idChamp
                    }
                }
                await champPoolSave(champPool)
                    .then((response) => {
                    })
                    .catch(error => {
                        console.log(error.response.data.response);
                    })
            }
        }


        await userFindById(user.idUser).then((response) => {
            dispatch(resetUser());
            dispatch(setUser(response.data.objResponse));
        }).catch(error => {
            console.log(error.response.data.response)
            alert('Utente non trovato');
        })

        alert('Champion pool aggiornata');
    }


    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
    };

    return (
        <div>
            <Navbar />
            <header className="bg-gray bg-gradient text-white">
                <h1 className="display-6">CHAMPION MANAGEMENT</h1>
                <p className=" text-center mx-auto" style={{ maxWidth: '900px' }}>
                    Click champions on the left to add them to your <b>Champion Pool</b>,<br/>
                    and click them on the right to remove. Don’t forget to <b>Save</b>!
                </p>
                <br />

                {/* Barra di ricerca */}
                <div className="container mb-3">
                    <div className="row justify-content-center">
                        <div className="col-md-4">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search champions..."
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

                <button
                    className="btn btn-purple btn-md"
                    type="button"
                    onClick={() => updateChampPool()}
                >
                    Save
                </button>

                <div className="container-fluid">
                    <div className="row justify-content-center">

                        {/* Prima colonna */}
                        <div className="col-12 col-md-5" style={{ margin: '10px', height: '50vh' }}>
                            <div className="rounded-top d-flex flex-column h-100" style={{ border: '5px solid #242424' }}>
                                <div className="bg-dark text-white text-center p-2">
                                    Champions
                                </div>
                                <div className="flex-grow-1 overflow-auto p-2 text-center" style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '3px',
                                    justifyContent: 'center',
                                    alignContent: 'flex-start'
                                }}>
                                    {displayedFilteredChamps && displayedFilteredChamps.length > 0 ? (
                                        <DraggableChampions
                                            champions={displayedFilteredChamps}
                                            onChampionClick={handleAddChampion}
                                        />
                                    ) : (
                                        <div className="text-white-50 mt-4">
                                            {searchTerm ? "No champions found" : "No champions available"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Seconda colonna */}
                        <div className="col-12 col-md-5" style={{ margin: '10px', height: '50vh' }}>
                            <div className="rounded-top d-flex flex-column h-100" style={{ border: '5px solid #242424' }}>
                                <div className="bg-dark text-white text-center p-2">
                                    Champion pool

                                </div>
                                <div className="flex-grow-1 overflow-auto p-2 text-center" style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '3px',
                                    justifyContent: 'center',
                                    alignContent: 'flex-start'
                                }}>
                                    {displayedPickedChamps && displayedPickedChamps.length > 0 ? (
                                        <DraggableChampions
                                            champions={displayedPickedChamps}
                                            onChampionClick={handleRemoveChampion}
                                        />
                                    ) : (
                                        <div className="text-white-50 mt-4">
                                            {searchTerm ? "No champions found" : "Your Champion Pool is empty"}
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

export default ChampionPool;