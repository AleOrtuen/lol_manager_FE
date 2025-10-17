import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ChampionInfoHoverBox = ({
    champion,
    onSelectChampion,
    champRoles = [],
    champPicked = [],
    size,
    locked = false,
    passiveState = false,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const [openLeft, setOpenLeft] = useState(false); // indica se aprire a sx o dx
    const boxRef = useRef(null);
    const dropdownWidth = 250; // larghezza tendina fissa

    const getChampionAlternatives = () => {
        if (!champion) return [];

        const currentChampId = champion.idChamp;

        return champRoles.filter(
            (item) => item.champion && item.champion.idChamp === currentChampId
        );
    };


    const championAlternatives = getChampionAlternatives();

    useEffect(() => {
        if (isHovered && boxRef.current) {
            const rect = boxRef.current.getBoundingClientRect();
            const gap = 8;

            // Controlla se siamo oltre metà larghezza finestra
            const shouldOpenLeft = rect.left > window.innerWidth / 2;

            setOpenLeft(shouldOpenLeft);

            setDropdownPos({
                top: rect.top + window.scrollY,
                left: shouldOpenLeft
                    ? rect.left + window.scrollX - dropdownWidth - gap
                    : rect.right + window.scrollX + gap,
            });
        }
    }, [isHovered]);

    return (
        <>
            <div
                ref={boxRef}
                style={{
                    minWidth: size,
                    textAlign: 'center',
                    cursor: locked || passiveState ? 'not-allowed' : 'pointer',
                    filter: locked || passiveState ? 'grayscale(100%) brightness(0.6)' : 'none',
                    pointerEvents: locked ? 'auto' : 'auto', // consenti click anche se locked, oppure cambia come preferisci
                    borderRadius: '8px',
                    display: 'inline-block',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => {
                    if (!locked && !passiveState && champion && onSelectChampion) {
                        onSelectChampion(champion);
                    }
                }}
            >
                <img
                    src={champion.img ? `/img/champions/${champion.img}` : ''}
                    alt={champion.name}
                    style={{
                        width: size ?? '67px',
                        height: size ?? '67px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                    }}
                    className="image-hover"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            </div>

            {isHovered && champion && createPortal(
                <div
                    style={{
                        position: 'absolute',
                        top: dropdownPos.top,
                        left: dropdownPos.left,
                        backgroundColor: 'rgba(0,0,0,0.85)',
                        color: '#fff',
                        padding: '10px',
                        borderRadius: '8px',
                        width: dropdownWidth,
                        maxHeight: '300px',
                        overflowY: 'auto',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                        zIndex: 10000,
                        fontSize: '0.9rem',
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div>
                        <strong>Champion:</strong> {champion.name}
                    </div>
                    {championAlternatives.length > 0 ? (
                        championAlternatives.map((alt, index) => (
                            <div
                                key={index}
                                style={{ borderBottom: '1px solid #444', paddingBottom: '6px', marginBottom: '6px' }}
                            >
                                <div>
                                    <strong>Role:</strong> {alt.role || 'Unknown'}
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
                                    <div style={{ color: 'lightgreen' }}>
                                        <strong>Power Pick</strong>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div style={{ color: 'yellow' }}>No alternative roles/comps found</div>
                    )}
                </div>,
                document.body
            )}
        </>
    );
};

export default ChampionInfoHoverBox;
