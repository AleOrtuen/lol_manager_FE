import { useState, useMemo } from 'react';
import top from '../../img/roles/top.webp';
import jng from '../../img/roles/jng.webp';
import mid from '../../img/roles/mid.webp';
import adc from '../../img/roles/adc.webp';
import sup from '../../img/roles/sup.webp';
import Champions from '../Champions';

function ChampionGallery({ 
    champions = [], 
    leagueRoles = [], 
    onSelectChampion, 
    lockedChampions = new Set(), 
    passiveState = false,
    searchTerm = "",
    onSearchChange,
    selectedChampion = null 
}) {
    const [activeTab, setActiveTab] = useState(null); // Nessun filtro attivo di default

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

        if (!activeTab) return filteredChampions;

        const championsForRole = leagueRoles
            .filter(leagueRole => leagueRole.role === activeTab)
            .map(leagueRole => leagueRole.champ)
            .filter(champ => {
                if (searchTerm.trim()) {
                    return champ.name.toLowerCase().includes(searchTerm.toLowerCase());
                }
                return true;
            });

        return Array.from(new Map(championsForRole.map(item => [item.idChamp, item])).values());
    }, [champions, leagueRoles, activeTab, searchTerm]);

    const handleTabChange = (tab) => {
        setActiveTab(prev => (prev === tab ? null : tab)); // Toggle: disattiva se è già selezionato
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
            <div className="bg-dark d-flex">
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
                            style={{
                                maxHeight: '20px',
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                ))}

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
                    gap: '3px',
                    justifyContent: 'center',
                    alignContent: 'flex-start'
                }}
            >
                {getDisplayedChampions.length > 0 ? (
                    <Champions
                        champions={getDisplayedChampions}
                        onSelectChampion={onSelectChampion}
                        lockedChampions={lockedChampions}
                        passiveState={passiveState}
                        size={"90px"}
                    />
                ) : (
                    <div className="text-white-50 mt-4">
                        {searchTerm 
                            ? "Nessun campione trovato" 
                            : `Nessun campione disponibile${activeTab ? ` per il ruolo ${activeTab}` : ''}`
                        }
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChampionGallery;
