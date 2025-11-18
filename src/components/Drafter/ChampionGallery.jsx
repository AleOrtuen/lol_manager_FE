import { useState, useMemo } from 'react';
import top from '../../img/roles/top.webp';
import jng from '../../img/roles/jng.webp';
import mid from '../../img/roles/mid.webp';
import adc from '../../img/roles/adc.webp';
import sup from '../../img/roles/sup.webp';
import Champions from '../Champions';

import ChampionInfoHoverBox from './ChampionInfoHoverBox';

function ChampionGallery({
    champions = [],
    leagueRoles = [],
    onSelectChampion,
    lockedChampions = new Set(),
    passiveState = false,
    searchTerm = "",
    onSearchChange,
    selectedChampion = null,
    registeredTeam,
    champRoles = []
}) {
    const [activeTab, setActiveTab] = useState(null);
    const [useTeamRoles, setUseTeamRoles] = useState(false);

    const rolesData = [
        { role: 'top', image: top },
        { role: 'jng', image: jng },
        { role: 'mid', image: mid },
        { role: 'adc', image: adc },
        { role: 'sup', image: sup }
    ];

    const getDisplayedChampions = useMemo(() => {
        let filteredChampions = champions;

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filteredChampions = filteredChampions.filter(champion =>
                champion.name.toLowerCase().includes(term)
            );
        }

        if (!activeTab) {
            if (useTeamRoles) {
                const uniqueChamps = Array.from(
                    new Map(
                        champRoles
                            .filter(roleObj => roleObj.champion || roleObj.champ)
                            .map(roleObj => {
                                const champ = roleObj.champion || roleObj.champ;
                                return [champ.idChamp, champ];
                            })
                    ).values()
                );

                return uniqueChamps
                    .filter(champ =>
                        champ && champ.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .sort((a, b) => a.name.localeCompare(b.name)); // 👈 Ordina alfabeticamente
            }

            return filteredChampions.sort((a, b) => a.name.localeCompare(b.name));

        }


        const selectedRoles = useTeamRoles ? champRoles : leagueRoles;

        const championsForRole = selectedRoles
            .filter(roleObj => roleObj.role === activeTab && (roleObj.champ || roleObj.champion))
            .map(roleObj => roleObj.champ || roleObj.champion)
            .filter(champ => {
                if (!champ) return false;
                if (searchTerm.trim()) {
                    return champ.name.toLowerCase().includes(searchTerm.toLowerCase());
                }
                return true;
            });

        return Array.from(
            new Map(
                championsForRole
                    .filter(item => item && item.idChamp)
                    .map(item => [item.idChamp, item])
            ).values()
        );
    }, [champions, leagueRoles, champRoles, activeTab, searchTerm, useTeamRoles]);

    const handleTabChange = (tab) => {
        setActiveTab(prev => (prev === tab ? null : tab));
    };

    const handleClearSearch = () => {
        if (onSearchChange) {
            onSearchChange({ target: { value: "" } });
        }
    };

    return (
        <div
            className="rounded-top d-flex flex-column h-100"
            style={{ border: '5px solid #242424' }}
        >
            <div className="bg-dark d-flex align-items-center">
                {/* Tabs per ruoli */}
                {rolesData.map((roleInfo) => (
                    <div
                        key={roleInfo.role}
                        className={`tab-item py-2 px-3 text-center ${activeTab === roleInfo.role ? 'bg-secondary' : ''}`}
                        onClick={() => handleTabChange(roleInfo.role)}
                        style={{
                            cursor: 'pointer',
                            minWidth: '50px',
                            borderLeft: '1px solid #333',
                        }}
                    >
                        <img
                            src={roleInfo.image}
                            alt={roleInfo.role}
                            className="img-fluid mx-auto image-hover"
                            style={{ maxHeight: '20px', objectFit: 'contain' }}
                        />
                    </div>
                ))}

                {/* Switch team */}
                {registeredTeam && registeredTeam.idTeam && (
                    <div className="form-check form-switch py-2 ms-auto px-3">
                        <label className="form-check-label text-white" htmlFor="switchCheckDefault">Team</label>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switchCheckDefault"
                            checked={useTeamRoles}
                            onChange={(e) => setUseTeamRoles(e.target.checked)}
                        />
                    </div>
                )}

                {/* Barra di ricerca */}
                <div className="ms-auto px-2" style={{ maxWidth: '250px' }}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search champions..."
                            value={searchTerm}
                            onChange={onSearchChange}
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

            {/* Visualizzazione dei campioni */}
            <div
                className="flex-grow-1 overflow-auto p-2 text-center"
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '2px',
                    justifyContent: 'center',
                    alignContent: 'flex-start'
                }}
            >
                {getDisplayedChampions.length > 0 ? (
                    useTeamRoles ? (
                        getDisplayedChampions.map((champ, index) => (
                            <ChampionInfoHoverBox
                                key={champ.idChamp}
                                champion={champ}
                                onSelectChampion={onSelectChampion}
                                champRoles={champRoles}
                                locked={lockedChampions.has(champ.idChamp)}
                                passiveState={passiveState}
                                size={"99px"}
                            />
                        ))
                    ) : (
                        <Champions
                            champions={getDisplayedChampions}
                            onSelectChampion={onSelectChampion}
                            lockedChampions={lockedChampions}
                            passiveState={passiveState}
                            size={"99px"}
                        />
                    )
                ) : (
                    <div className="text-white-50 mt-4">
                        {searchTerm
                            ? "Nessun campione trovato"
                            : `Nessun campione disponibile${activeTab ? ` per il ruolo ${activeTab}` : ''}`}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChampionGallery;
