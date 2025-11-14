import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { teamFindChamps, teamFindMembers } from "../service/teamService";
import { teamAnalysisFindTeam } from "../service/teamAnalysisService";
import Champions from "./Champions";
import topIco from "../img/roles/top_ico.png";
import jngIco from "../img/roles/jng_ico.png";
import midIco from "../img/roles/mid_ico.png";
import adcIco from "../img/roles/adc_ico.png";
import supIco from "../img/roles/sup_ico.png";
import fillIco from "../img/roles/fill_ico.png";
import coachIco from "../img/roles/coach_ico.png";
import opggLogo from "../img/opgg_logo.webp";
import RateCircle from "./RateCircle";
import { teamMemberDelete, teamMemberFindTeam } from "../service/teamMemberService";
import { TEAM_UPDATE, TEAMS } from "../utils/routes";
import { setTeam } from "../store/slice/teamSlice";

function Team() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const teams = useSelector((state) => state.team);
  const user = useSelector((state) => state.user);
  const [champs, setChamps] = useState();
  const [members, setMembers] = useState([]);
  const [membersRole, setMembersRole] = useState([]);
  const [teamData, setTeamData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const rolesData = [
    { role: "top", image: topIco },
    { role: "jng", image: jngIco },
    { role: "mid", image: midIco },
    { role: "adc", image: adcIco },
    { role: "sup", image: supIco },
    { role: "fill", image: fillIco },
    { role: "coach", image: coachIco },
  ];

  useEffect(() => {
    const idTeam = location.state?.idTeam;
    if (!idTeam) return;

    setChamps(null);
    setIsLoading(true);

    Promise.allSettled([
      teamFindChamps(idTeam),
      teamMemberFindTeam(idTeam),
      teamFindMembers(idTeam),
      teamAnalysisFindTeam(idTeam),
    ])
      .then((results) => {
        // Estrai i dati dalle promise risolte, usa valori di default per quelle fallite
        const champsData = results[0].status === 'fulfilled' ? results[0].value.data.objResponse : null;
        const membersRoleData = results[1].status === 'fulfilled' ? results[1].value.data.objResponse : [];
        const membersData = results[2].status === 'fulfilled' ? results[2].value.data.objResponse : [];
        const teamStats = results[3].status === 'fulfilled' ? results[3].value.data.objResponse : null;

        // Log errori per debug
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            const apiNames = ['teamFindChamps', 'teamMemberFindTeam', 'teamFindMembers', 'teamAnalysisFindTeam'];
            console.warn(`${apiNames[index]} fallito:`, result.reason);
          }
        });

        // Mappa dei ruoli/admin
        const membersRolesMap = membersRoleData.reduce((acc, mr) => {
          acc[mr.idUser] = { role: mr.role, admin: mr.admin };
          return acc;
        }, {});

        // Merge membri con ruolo e admin
        const mergedMembers = membersData.map((member) => ({
          ...member,
          pRole: membersRolesMap[member.idUser]?.role ?? member.pRole,
          isAdmin: membersRolesMap[member.idUser]?.admin ?? false,
        }));

        // Ordina membri per ruolo
        const orderedMembers = mergedMembers.sort((a, b) => {
          const indexA = rolesData.findIndex((r) => r.role === a.pRole?.toLowerCase());
          const indexB = rolesData.findIndex((r) => r.role === b.pRole?.toLowerCase());
          return (indexA === -1 ? rolesData.length : indexA) - (indexB === -1 ? rolesData.length : indexB);
        });

        setChamps(champsData);
        setMembersRole(membersRoleData);
        setMembers(orderedMembers);
        setTeamData(teamStats);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Errore imprevisto nel caricamento dati team:", err);
        setIsLoading(false);
      });
  }, [location.state]);

  const leaveTeam = async () => {
    const confirmed = window.confirm("Sei sicuro di voler lasciare questo team?");
    if (!confirmed) return;

    try {
      await teamMemberDelete(user.idUser, location.state.idTeam);
      const teamsListUpdate = teams.filter(team => team.idTeam !== location.state.idTeam);
      dispatch(setTeam(teamsListUpdate));
      alert("Hai lasciato il team con successo.");
      navigate(TEAMS);
    } catch (err) {
      console.error(err);
      alert("Errore durante la rimozione dal team.");
    }
  };

  // Determina se l'utente corrente è admin
  // IMPORTANTE: usa membersRole, NON members (che potrebbe non includere user senza champion)
  const isUserAdmin = () => {
    console.log('=== DEBUG isUserAdmin ===');
    console.log('user.idUser:', user.idUser);
    console.log('user.admin:', user.admin);
    console.log('membersRole:', membersRole);

    // Se è admin globale, mostra sempre Edit Team
    if (user.admin === true) {
      console.log('✅ User è admin globale');
      return true;
    }

    // Controlla se è admin del team specifico in membersRole
    const userRole = membersRole.find(mr => mr.idUser === user.idUser);
    console.log('userRole trovato:', userRole);
    console.log('userRole?.admin:', userRole?.admin);

    const isAdmin = userRole?.admin === true;
    console.log('Risultato finale isAdmin:', isAdmin);
    return isAdmin;
  };

  return (
    <div>
      <Navbar />
      <header className="bg-dark bg-gradient text-white py-4">
        {teams.map((team) =>
          location.state && team.idTeam === location.state.idTeam ? (
            <div className="container" key={team.idTeam}>
              {/* BOX INFO */}
              <div className="p-4 d-flex flex-wrap align-items-start justify-content-center" style={{
                backgroundColor: "rgba(0,0,0,0.3)",
                borderRadius: "8px",
                boxShadow: "0 0 8px rgba(255,255,255,0.1)",
                maxWidth: "900px",
                margin: "0 auto",
                gap: "2rem",
              }}>
                {/* COLONNA SINISTRA: LOGO + MODIFICA */}
                <div className="d-flex flex-column align-items-center mb-3 mb-md-0">
                  <img
                    src={baseUrl + team.img}
                    alt={team.name || "No Champion"}
                    className="img-fluid"
                    style={{
                      maxWidth: "150px",
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      objectFit: "cover",
                      border: "2px solid rgba(255,255,255,0.2)",
                    }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "../img/champions/champless.png";
                    }}
                  />

                  {/* Mostra il pulsante solo dopo il caricamento */}
                  {!isLoading && (
                    isUserAdmin() ? (
                      <button
                        className="btn btn-purple btn-sm mt-2 px-4 w-100"
                        onClick={() =>
                          navigate(TEAM_UPDATE, { state: { team, members, membersRole } })
                        }
                      >
                        Edit Team
                      </button>
                    ) : (
                      <button
                        className="btn btn-danger btn-sm mt-2 px-4"
                        onClick={leaveTeam}
                      >
                        Leave team
                      </button>
                    )
                  )}

                  {/* ACCORDION COACH */}
                  <div
                    className="accordion mt-3"
                    id="accordionCoach"
                    style={{
                      width: "100%",
                      maxWidth: "150px", // 👈 stessa larghezza del logo
                      alignSelf: "center",
                    }}
                  >
                    <div className="accordion-item border-0 bg-transparent">
                      <h2 className="accordion-header" id="headingCoach">
                        <button
                          className="accordion-button collapsed bg-transparent text-white shadow-none"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseCoach"
                          aria-expanded="false"
                          aria-controls="collapseCoach"
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            padding: "6px 8px",
                            paddingRight: "24px", // spazio per la freccia
                            paddingLeft: "24px", // 👈 stesso spazio a sinistra per bilanciare
                            textAlign: "center",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            position: "relative",
                          }}
                        >
                          <img
                            src={coachIco}
                            alt="coach"
                            style={{
                              width: "20px",
                              height: "20px",
                              flexShrink: 0,
                            }}
                          />
                          <strong style={{ fontSize: "0.9rem" }}>Coach</strong>
                        </button>
                      </h2>
                      <div
                        id="collapseCoach"
                        className="accordion-collapse collapse bg-transparent"
                        aria-labelledby="headingCoach"
                        data-bs-parent="#accordionCoach"
                      >
                        <div
                          className="accordion-body text-center text-white bg-transparent"
                          style={{
                            borderTop: "1px solid rgba(255,255,255,0.1)",
                            maxWidth: "100%",
                            overflow: "hidden",
                            padding: "8px",
                          }}
                        >
                          {members.some((m) => m.pRole?.toLowerCase() === "coach") ? (
                            members
                              .filter((m) => m.pRole?.toLowerCase() === "coach")
                              .map((coach) => (
                                <div
                                  key={coach.idUser}
                                  className="py-1 text-truncate"
                                  style={{
                                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    fontSize: "0.85rem",
                                  }}
                                >
                                  {coach.username}
                                </div>
                              ))
                          ) : (
                            <div className="text-muted text-truncate" style={{ fontSize: "0.85rem" }}>
                              No coach available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {team.opgg ? (
                    <a href={team.opgg} target="_blank" rel="noopener noreferrer">
                      <img
                        src={opggLogo}
                        alt="opgg link"
                        className="img-fluid"
                        style={{
                          maxWidth: "100px",
                          width: "100%",
                          height: "auto",
                          objectFit: "cover",
                          transition: "filter 0.3s ease",
                          cursor: "pointer",
                        }}
                      />
                    </a>
                  ) : (
                    <img
                      src={opggLogo}
                      alt="opgg logo"
                      className="img-fluid"
                      style={{
                        maxWidth: "100px",
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        filter: "grayscale(100%)",
                        opacity: 0.5,
                      }}
                    />
                  )}
                </div>

                {/* COLONNA DESTRA: NAME + TAG + WINRATE */}
                <div className="flex-grow-1 text-center text-md-start">
                  <h1 className="display-6 mb-1">{team.name}</h1>
                  <p className="mb-2"><strong>{team.tag}</strong></p>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    textAlign: "center",
                    marginTop: "1.5rem",
                    flexWrap: "wrap",
                    gap: "1.5rem",
                  }}>
                    {/* TOTAL */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <p className="fw-bold mb-0">Total</p>
                      <p className="mb-0">Played: {teamData?.gamesCount ?? "N/A"}</p>
                      <RateCircle 
                        rate={teamData?.winRate} 
                        count={teamData?.winCount} 
                        size={120}
                      />
                    </div>

                    {/* BLUE SIDE */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <p className="fw-bold mb-0" style={{ color: "#0d6efd" }}>Blue Side</p>
                      <p className="mb-0">Played: {teamData?.gamesCountBlue ?? "N/A"}</p>
                      <RateCircle 
                        rate={teamData?.winRateBlue} 
                        count={teamData?.winCountBlue} 
                        size={90}
                      />
                    </div>

                    {/* RED SIDE */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <p className="fw-bold mb-0" style={{ color: "#dc3545" }}>Red Side</p>
                      <p className="mb-0">Played: {teamData?.gamesCountRed ?? "N/A"}</p>
                      <RateCircle 
                        rate={teamData?.winRateRed} 
                        count={teamData?.winCountRed} 
                        size={90}
                      />
                    </div>
                    
                  </div>
                </div>
              </div>

              {/* MEMBRI TEAM */}
              <div className="d-flex justify-content-center mt-4">
                <div className="accordion bg-dark text-white w-100 w-md-75 w-lg-50" id="accordionExample">
                  {members
                    .filter(member => member.pRole?.toLowerCase() !== "coach") // 👈 esclude i coach
                    .map((member) => {
                      const roleObj = rolesData.find(r => r.role === member.pRole?.toLowerCase()) || { role: "fill", image: fillIco };

                      return (
                        <div className="accordion-item" key={member.idUser}>
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button bg-dark text-white custom-accordion-button text-center"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#collapse${member.idUser}`}
                              aria-expanded="false"
                              aria-controls={`collapse${member.idUser}`}
                              style={{ display: "flex", alignItems: "center", gap: "8px" }}
                            >
                              <img src={roleObj.image} alt={roleObj.role} style={{ width: "20px", height: "20px" }} />
                              {member.username}
                            </button>
                          </h2>
                          <div
                            id={`collapse${member.idUser}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading${member.idUser}`}
                            data-bs-parent="#accordionExample"
                          >
                            <div className="accordion-body custom-accordion-body text-center">
                              <Champions champions={member.champions} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

            </div>
          ) : null
        )}

        {!location.state && (
          <h1 className="display-6 text-center">Nessun team selezionato</h1>
        )}
      </header>
    </div>
  );
}

export default Team;
