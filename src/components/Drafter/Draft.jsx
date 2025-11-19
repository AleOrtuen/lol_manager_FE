import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { champFindAll } from "../../service/championsService";
import { leagueRoleFindAll } from "../../service/leagueRoleService";
import { useParams } from "react-router-dom";
import { gameRoomFindId } from "../../service/gameRoomService";
import { useWebSocketDraft } from "../web_socket/useWebSocketGame";
import GuestSelection from "./GuestSelection";
import SideSelection from "./SideSelection";
import Picks from "./Picks";
import Bans from "./Bans";
import { draftFindRoom } from "../../service/draftService";
import ReadyCheck from "./ReadyCheck";
import Timer from "./Timer";
import { banFindByDraft } from "../../service/banService";
import { pickFindByDraft, pickFindByGame } from "../../service/pickService";
import ChampionGallery from "./ChampionGallery";
import WinnerSelection from "./WinnerSelection";
import { useDispatch, useSelector } from "react-redux";
import DraftSelection from "./DraftSelection";
import Score from "./Score";
import { teamCompFindTeam } from "../../service/teamCompService";
import { champRoleFindComp } from "../../service/champRoleService";


function Draft() {
    const dispatch = useDispatch();
    const teams = useSelector((state) => Object.values(state.team));
    const [comps, setComps] = useState([]);
    const [champRoles, setChampRoles] = useState([]);
    const { idRoom, role } = useParams();
    const [champions, setChampions] = useState([]);
    const [leagueRoles, setLeagueRoles] = useState([]);
    const [game, setGame] = useState();
    const [draft, setDraft] = useState();
    const [draftList, setDraftList] = useState();
    const [selectedDraftIndex, setSelectedDraftIndex] = useState(0);
    const [selectedChampion, setSelectedChampion] = useState(null);
    const [remoteSelectedChampion, setRemoteSelectedChampion] = useState(null);
    const [blueWins, setBlueWins] = useState(0);
    const [redWins, setRedWins] = useState(0);
    const [currentPhase, setCurrentPhase] = useState();
    const [pageLoading, setPageLoading] = useState(false);
    const [passiveState, setPassiveState] = useState();
    const [yourSide, setYourSide] = useState();
    const yourSideRef = useRef();
    const [registeredTeam, setRegisteredTeam] = useState();
    const [searchTerm, setSearchTerm] = useState("");
    const [uniqueChamp, setUniqueChamp] = useState({
        top: [],
        jng: [],
        mid: [],
        adc: [],
        sup: []
    });

    const [blueBans, setBlueBans] = useState(
        Array(5).fill({ champ: null, locked: false })
    );
    const [redBans, setRedBans] = useState(
        Array(5).fill({ champ: null, locked: false })
    );
    const [bluePicks, setBluePicks] = useState(
        Array(5).fill({ champ: null, locked: false })
    );
    const [redPicks, setRedPicks] = useState(
        Array(5).fill({ champ: null, locked: false })
    );
    const [fearlessPicks, setFearlessPicks] = useState([]);

    //WEBSOCKET EVENTS
    const onWebSocketMessage = useCallback((msg) => {
        if (msg.type === "GAME_UPDATE" && msg.game) {
            console.log("🆕 GAME_UPDATE received", msg.game);
            setGame(msg.game);
        }

        if (msg.type === "DRAFT_UPDATE" && msg.draft) {
            console.log("🆕 DRAFT_UPDATE received", msg.draft);

            setDraft(prev => {
                if (!prev || prev.idDraft !== msg.draft.idDraft) return msg.draft;
                return { ...prev, ...msg.draft }; // Merge changes se serve
            });

            setDraftList(prevList => {
                if (!prevList) return [msg.draft];

                const index = prevList.findIndex(d => d.idDraft === msg.draft.idDraft);
                if (index !== -1) {
                    // draft già presente: aggiorna
                    const updated = [...prevList];
                    updated[index] = msg.draft;
                    return updated;
                } else {
                    // nuova draft: aggiungila
                    return [...prevList, msg.draft];
                }
            });
        }

        if (msg.type === "EVENT_CHANGE" && msg.events) {
            const nextPhase = msg.events.currentPhase;
            console.log("🆕 EVENTS_UPDATE received", msg.events);
            const side = yourSideRef.current;
            setCurrentPhase(nextPhase);
            setSelectedChampion(null);
            setRemoteSelectedChampion(null);
            if (role !== 'spectate') {
                setPassiveState(
                    (side === 'blue' && nextPhase.startsWith("blue")) ||
                        (side === 'red' && nextPhase.startsWith("red")) ? false : true
                );
            }
        }

        if (msg.type === "CURRENT_EVENT" && msg.events) {
            const current = msg.events.currentPhase;
            console.log("🆕 CURRENT_EVENT received", current);
            setCurrentPhase(current);

            const side = yourSideRef.current;
            if (!side) {
                console.warn("⚠️ yourSideRef ancora non inizializzato, salto setPassiveState");
                return;
            }

            if (role !== 'spectate') {
                setPassiveState(
                    (side === 'blue' && nextPhase.startsWith("blue")) ||
                        (side === 'red' && nextPhase.startsWith("red")) ? false : true
                );
            }
        }

        if (msg.type === "SELECTED_CHAMP" && msg.champion && role !== msg.sender) {
            console.log("🆕 SELECTED_CHAMP received", msg.champion);
            setRemoteSelectedChampion(msg.champion);
        }

        if (msg.type === "CHAMP_BAN" && msg.champion && msg.side) {
            console.log("🆕 CHAMP_BAN received", msg.champion);
            const setBans = msg.side === "blue" ? setBlueBans : setRedBans;

            const match = msg.events.currentPhase?.match(/Ban(\d)/i);
            const index = match ? parseInt(match[1], 10) - 1 : -1;

            if (index >= 0 && index < 5) {
                setBans(prev => {
                    const updated = [...prev];
                    updated[index] = { champ: msg.champion, locked: true };
                    return updated;
                });
            } else {
                console.warn("⚠️ Indice di ban non valido:", msg.phase);
            }
        }

        if (msg.type === "CHAMP_PICK" && msg.champion && msg.side) {
            console.log("🆕 CHAMP_PICK received", msg.champion);
            const setPicks = msg.side === "blue" ? setBluePicks : setRedPicks;

            const match = msg.events.currentPhase?.match(/Pick(\d)/i);
            const index = match ? parseInt(match[1], 10) - 1 : -1;

            if (index >= 0 && index < 5) {
                setPicks(prev => {
                    const updated = [...prev];
                    updated[index] = { champ: msg.champion, locked: true };
                    return updated;
                });
            } else {
                console.warn("⚠️ Indice di pick non valido:", msg.phase);
            }
        }
    }, [setGame, setDraft, setCurrentPhase, setPassiveState, setRemoteSelectedChampion]);

    const { sendMessage, connected } = useWebSocketDraft(idRoom, onWebSocketMessage);

    //FIND ALL CHAMPS, GAME AND DRAFT
    useEffect(() => {
        champFindAll()
            .then((response) => {
                setChampions(response.data.objResponse);
            })
            .catch(error => {
                console.log(error.response.data.response);
            })

        gameRoomFindId(idRoom)
            .then((response) => {
                setGame(response.data.objResponse.game);
            })
            .catch(error => {
                console.log(error.response.data.response);
            })

        draftFindRoom(idRoom)
            .then((response) => {
                const drafts = response.data.objResponse;
                const defaultIndex = drafts.findIndex(d => d.winner === null);

                const selected = drafts[defaultIndex !== -1 ? defaultIndex : 0];

                setDraftList(drafts);
                setSelectedDraftIndex(defaultIndex !== -1 ? defaultIndex : 0);
                setDraft(selected);

            })
            .catch(error => {
                console.log(error.response.data.response);
            });

        leagueRoleFindAll()
            .then((response) => {
                setLeagueRoles(response.data.objResponse);
            })
            .catch(error => {
                consoleLogs.log(error.response.data.response);
            })

    }, []);

    // VERIFY IF THE GAME EXIST BEFORE LOAD THE PAGE
    useEffect(() => {
                console.log(game);
        if (role === 'spectate') {
            setPageLoading(true);
            setPassiveState(true);
            return
        }
        if (!game) return;

        if (role === 'player1' && game.team1 !== null) {
            setPageLoading(true);
        }

        if (role === 'player2' && game.team2 !== null) {
            setPageLoading(true);
        }
        console.log(game);
    }, [game, role]);

    // SELECT CORRECT DRAFT FROM THE MULTI BUTTON RESULT
    useEffect(() => {
        if (draftList && draftList.length > 0 && selectedDraftIndex >= 0) {
            const selected = draftList[selectedDraftIndex];
            setDraft(selected);
        }
    }, [selectedDraftIndex, draftList]);

    // CHECK WHAT SIDE THE TEAM IS PLAYING AND SET REGISTERED TEAM. RETRIEVE PICKS AND BANS
    useEffect(() => {
        if (!draft || !game) return;

        setBlueBans(Array(5).fill({ champ: null, locked: false }));
        setRedBans(Array(5).fill({ champ: null, locked: false }));
        setBluePicks(Array(5).fill({ champ: null, locked: false }));
        setRedPicks(Array(5).fill({ champ: null, locked: false }));

        const yourTeam = role === "player1" ? game.team1 : game.team2;

        const yourTeamId = yourTeam?.idTeam;
        const teamBlueId = draft?.teamBlue?.idTeam;

        const side = yourTeamId && teamBlueId && yourTeamId === teamBlueId ? "blue" : "red";
        yourSideRef.current = side;
        setYourSide(side);

        if (yourTeamId && teams.some(team => team.idTeam === yourTeamId)) {
            setRegisteredTeam(yourTeam);
        }

        banFindByDraft(draft.idDraft)
            .then((response) => {
                const bans = response.data.objResponse;

                const blue = bans.filter(b => b.side === 'blue');
                const red = bans.filter(b => b.side === 'red');

                const blueMapped = Array(5).fill({ champ: null, locked: false }).map((_, i) => {
                    return blue[i] ? { champ: blue[i].ban, locked: true } : { champ: null, locked: false };
                });

                const redMapped = Array(5).fill({ champ: null, locked: false }).map((_, i) => {
                    return red[i] ? { champ: red[i].ban, locked: true } : { champ: null, locked: false };
                });

                setBlueBans(blueMapped);
                setRedBans(redMapped);
            })
            .catch(error => {
                console.log(error.response?.data?.response || error.message);
            });

        pickFindByDraft(draft.idDraft)
            .then((response) => {
                const picks = response.data.objResponse;

                const blue = picks.filter(b => b.side === 'blue');
                const red = picks.filter(b => b.side === 'red');

                const blueMapped = Array(5).fill({ champ: null, locked: false }).map((_, i) => {
                    return blue[i] ? { champ: blue[i].pick, locked: true } : { champ: null, locked: false };
                });

                const redMapped = Array(5).fill({ champ: null, locked: false }).map((_, i) => {
                    return red[i] ? { champ: red[i].pick, locked: true } : { champ: null, locked: false };
                });

                setBluePicks(blueMapped);
                setRedPicks(redMapped);
            })
            .catch(error => {
                console.log(error.response?.data?.response || error.message);
            });

        if (game && game.fearless) {
            pickFindByGame(game.idGame)
                .then((response) => {
                    setFearlessPicks(response.data.objResponse);
                })
                .catch(error => {
                    console.log(error.response?.data?.response || error.message);
                });
        }

    }, [draft, role, game]);

    // RETRIEVE TEAM COMPS
    useEffect(() => {
        if (registeredTeam && registeredTeam.idTeam) {
            teamCompFindTeam(registeredTeam.idTeam)
                .then((response) => {
                    setComps(response.data.objResponse);
                })
                .catch(error => {
                    console.log(error.response.data.response)
                })
        }
    }, [registeredTeam])

    // RETRIEVE CHAMP ROLES
    useEffect(() => {
        if (comps && comps.length > 0) {
            comps.forEach((comp) => {
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
    }, [comps])

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

    // SET SCORE FOR BOTH TEAMS
    useEffect(() => {
        if (!draftList || !draft) return;

        const teamBlueId = draft.teamBlue?.idTeam;
        const teamRedId = draft.teamRed?.idTeam;

        let blue = 0;
        let red = 0;

        draftList.forEach(d => {
            if (!d.winner) return;

            if (d.winner.idTeam === teamBlueId) {
                blue++;
            } else if (d.winner.idTeam === teamRedId) {
                red++;
            }
        });

        setBlueWins(blue);
        setRedWins(red);
    }, [draftList, draft]);

    // FIRST EVENT START AFTER READY CHECK
    useEffect(() => {
        if (draft?.ready && !draft?.closed && role === "player1") {
            sendMessage({
                idRoom,
                type: "EVENT",
                sender: role
            });
        }
    }, [draft?.ready, draft?.closed]);

    // RETRIEVE CURRENT EVENT ON UPDATE
    useEffect(() => {
        sendMessage({
            idRoom,
            type: "CURRENT_EVENT_REQUEST",
            sender: role
        });
    }, [connected]);

    // SEND INFO ABOUT PRESELECTED PICK
    useEffect(() => {
        if (!passiveState && selectedChampion) {
            sendMessage({
                idRoom,
                type: "PICK",
                sender: role,
                champion: selectedChampion
            });
        }
    }, [selectedChampion, passiveState]);

    const lockedChampions = useMemo(() => {
        const normalSlots = [...blueBans, ...redBans, ...bluePicks, ...redPicks];
        const normalIds = normalSlots
            .filter(slot => slot.champ !== null)
            .map(slot => typeof slot.champ === 'object' ? slot.champ.idChamp : slot.champ);

        const fearlessIds = fearlessPicks
            .map(p => typeof p.pick === 'object' ? p.pick.idChamp : p.pick); // adattare in base alla struttura

        return new Set([...normalIds, ...fearlessIds]);
    }, [blueBans, redBans, bluePicks, redPicks, fearlessPicks]);

    // METHOD TO LOCK CHAMPS(BANS AND PICKS)
    const lockChampion = () => {
        if (!passiveState) {
            sendMessage({
                idRoom,
                type: "LOCK",
                sender: role,
                events: {
                    currentPhase: currentPhase
                }
            });
        }
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const consoleLogs = () => {
        console.log(passiveState);
        // console.log(currentPhase);
        // console.log(leagueRoles);
        // console.log(yourSide);
        // console.log(draft);
        // console.log(draftList);
        // console.log(comps);
        // console.log(champRoles);
        // console.log(selectedDraftIndex);
        // console.log(blueBans);
        // console.log(redBans);
    };

    return (

        <div className="wide-component" style={{marginTop: '-50px'}}>

            {/* <button onClick={consoleLogs}>logs</button> */}
            {pageLoading && pageLoading === true ?
                <div>
                    <div className="row justify-content-center">
                        <div className="col-8 ">
                            {game && draftList?.length > 0 && (
                                <DraftSelection
                                    game={game}
                                    draftList={draftList}
                                    onSelect={(index) => setSelectedDraftIndex(index)}
                                    currentPhase={currentPhase}
                                />
                            )}
                        </div>
                    </div>
                    {/* TEAMS E PHASE */}
                    <div className="row justify-content-center">
                        {/* TEAM BLUE SIDE */}

                        <div className="col-4 div-blue">
                            {draft?.teamBlue?.name ?
                                <h1 className="display-6">{draft.teamBlue.name}</h1>
                                :
                                <h1 className="display-6">BLUE</h1>
                            }
                        </div>
                        {/* TIMER AND SERIES */}
                        <div className="col-1 d-flex align-items-center justify-content-start">
                            <h2>{blueWins}</h2>
                        </div>
                        <div className="col-2">
                            {draft && draft.ready && (currentPhase !== undefined && currentPhase !== 'end') ?
                                <Timer currentPhase={currentPhase}/>
                                : null
                            }
                        </div>
                        <div className="col-1 d-flex align-items-center justify-content-end">
                            <h2>{redWins}</h2>
                        </div>
                        {/* TEAM RED SIDE */}
                        <div className="col-4 div-red">
                            {draft?.teamRed?.name ?
                                <h1 className="display-6">{draft.teamRed.name}</h1>
                                :
                                <h1 className="display-6">RED</h1>
                            }
                        </div>
                    </div>

                    {/* PICKS E ALL CHAMPS */}
                    <div className="row">
                        {/* PICKS BLUE SIDE */}
                        <div className="col-1">
                            <Picks
                                side="blue"
                                selectedChampion={
                                    currentPhase?.startsWith("bluePick")
                                        ? (passiveState ? remoteSelectedChampion : selectedChampion)
                                        : undefined
                                }
                                lockedChampions={bluePicks}
                                currentPhase={currentPhase}
                            />
                        </div>
                        {/* CHAMPIONS AND SIDE SELECTION */}
                        <div className="col-10"
                             style={{
                                 height: '60vh'
                             }}
                        >
                            {draft?.closed && role !== 'spectate' ? (
                                <WinnerSelection draft={draft}/>
                            ) : (draft && draft.teamBlue && draft.teamRed) || role === 'spectate' ? (
                                <ChampionGallery
                                    champions={champions}
                                    leagueRoles={leagueRoles}
                                    onSelectChampion={(champ) => setSelectedChampion(champ)}
                                    lockedChampions={lockedChampions}
                                    passiveState={passiveState}
                                    searchTerm={searchTerm}
                                    onSearchChange={handleSearchChange}
                                    selectedChampion={selectedChampion}
                                    registeredTeam={registeredTeam}
                                    champRoles={champRoles}
                                />
                            ) : game && game.team1 && game.team2 ? (
                                <SideSelection game={game} draft={draft}/>
                            ) : (
                                <h5>Waiting for other team to join the game</h5>
                            )}
                        </div>
                        {/* PICKS RED SIDE */}
                        <div className="col-1">
                            <Picks
                                side="red"
                                selectedChampion={
                                    currentPhase?.startsWith("redPick")
                                        ? (passiveState ? remoteSelectedChampion : selectedChampion)
                                        : undefined
                                }
                                lockedChampions={redPicks}
                                currentPhase={currentPhase}
                            />
                        </div>
                    </div>

                    {/* BANS E BUTTON */}
                    <div className="row align-items-center" style={{marginTop: '20px'}}>
                        {/* BLUE BANS */}
                        <div className="col-5 d-flex justify-content-center align-items-center"
                             style={{display: 'flex', gap: '10px'}}>
                            <Bans
                                side="blue"
                                selectedChampion={
                                    currentPhase?.startsWith("blueBan")
                                        ? (passiveState ? remoteSelectedChampion : selectedChampion)
                                        : undefined
                                }
                                lockedChampions={blueBans}
                                currentPhase={currentPhase}
                            />
                        </div>

                        <div className="col-2">
                            {role !== 'spectate' ?
                                (draft && draft.ready === false && draft.teamBlue !== null ?
                                        <ReadyCheck draft={draft} setDraft={setDraft}/>
                                        :
                                        <button
                                            className="btn btn-secondary btn-lg"
                                            disabled={passiveState || selectedChampion === null}
                                            onClick={lockChampion}
                                        >
                                            Lock
                                        </button>
                                )
                                : null
                            }
                        </div>

                        {/* RED BANS */}
                        <div className="col-5 d-flex justify-content-center align-items-center"
                             style={{display: 'flex', gap: '10px'}}>
                            <Bans
                                side="red"
                                selectedChampion={
                                    currentPhase?.startsWith("redBan")
                                        ? (passiveState ? remoteSelectedChampion : selectedChampion)
                                        : undefined
                                }
                                lockedChampions={redBans}
                                currentPhase={currentPhase}
                            />
                        </div>
                    </div>
                </div>
                :
                <GuestSelection game={game}/>
            }
        </div>
    );
};

export default Draft;
