import React, { useState, useRef, useEffect } from 'react';

const ChampionBox = ({ pickNumber, pick, Champions, champRoles, champPicked }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    // Chiude il menu quando si clicca fuori
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    // Trova tutte le alternative per il champion selezionato
    const getChampionAlternatives = () => {
        if (!pick[pickNumber].champion) return [];
        
        const currentChampId = pick[pickNumber].champion.idChamp;
        let alternatives = [];
        
        // Determina quale lista usare in base allo stato di lock
        const sourceList = pick[pickNumber].locked && champPicked && champPicked.length > 0 
            ? champPicked 
            : champRoles;
        
        // Filtra tutte le occorrenze del champion nella lista
        if (sourceList && sourceList.length > 0) {
            alternatives = sourceList.filter(item => 
                item.champion && item.champion.idChamp === currentChampId
            );
        }
        
        return alternatives;
    };

    const championAlternatives = getChampionAlternatives();

    return (
        <div
            className="col-2 m-1 position-relative"
            style={{
                width: '85px',
                height: '85px',
                border: `2px solid ${pick[pickNumber].locked ? 'green' : '#555'}`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#333',
                borderRadius: '8px',
                cursor: 'pointer'
            }}
            onClick={toggleMenu}
        >
            <span className="text-secondary">
                {pick[pickNumber].champion ?
                    <Champions champions={[pick[pickNumber].champion]} /> :
                    <img 
                    src="../img/champions/champless.png"  // Sostituisci con il percorso dell'immagine
                    alt="No Champion"
                    style={{ width: '67px', height: '67px', objectFit: 'cover' }}  // Imposta dimensioni appropriate per l'immagine
                    />
                }
            </span>

            {/* Indicatore visivo (freccetta) sotto il quadrato */}
            <div 
                style={{
                    position: 'absolute',
                    bottom: '-20px',  // Posiziona la freccetta sotto il quadrato
                    left: '50%',
                    transform: 'translateX(-50%)',  // Centra la freccetta
                    fontSize: '25px',  // Modifica la dimensione della freccetta
                    color: '#ccc',
                    cursor: 'pointer'
                }}
            >
                {/* Freccetta che cambia direzione a seconda di `showMenu` */}
                {showMenu ? <i class="bi bi-caret-up-fill"></i> : <i class="bi bi-caret-down-fill"></i>}

            </div>

            {showMenu && pick[pickNumber].champion && (
                <div 
                    ref={menuRef}
                    className="position-absolute bg-dark text-light p-2"
                    style={{
                        top: '110%',
                        left: '-100%',
                        zIndex: 1000,
                        minWidth: '250px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        border: '1px solid #555',
                        borderRadius: '8px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                >
                    <div className="mb-2">
                        <strong>Champion:</strong> {pick[pickNumber].champion.name || "Unknown"}
                    </div>
                    
                    {championAlternatives.length > 0 ? (
                        <div className="mt-2">
                            {championAlternatives.map((alt, index) => (
                                <div key={index} className="p-2 mb-2 border-bottom">
                                    <div>
                                        <strong>Role:</strong> {alt.role || "Unknown"}
                                    </div>
                                    {alt.comp && alt.comp.name && (
                                        <div>
                                            <strong>Comp:</strong> {alt.comp.name}
                                        </div>
                                    )}
                                    {alt.comp && alt.comp.descr && (
                                        <div>
                                            <strong>Description:</strong> {alt.comp.descr}
                                        </div>
                                    )}
                                    {alt.descr && (
                                        <div>
                                            <strong>Notes:</strong> {alt.descr}
                                        </div>
                                    )}
                                    {alt.powerPick && (
                                        <div className="text-success">
                                            <strong>Power Pick</strong>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-warning">No alternative roles/comps found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChampionBox;
