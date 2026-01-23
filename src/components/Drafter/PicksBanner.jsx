import React from "react";

function PicksBanner({ selectedChampion, lockedChampions = [], currentPhase, side, align }) {

    const baseUrlBanner = "https://ddragon.leagueoflegends.com/cdn/img/champion/centered";

    const phaseToIndex = {
        bluePick1: 0,
        bluePick2: 1,
        bluePick3: 2,
        bluePick4: 3,
        bluePick5: 4,
        redPick1: 0,
        redPick2: 1,
        redPick3: 2,
        redPick4: 3,
        redPick5: 4
    };

    const activeIndex = currentPhase?.startsWith(side)
        ? phaseToIndex[currentPhase]
        : null;

    const getChampionImageUrl = (img) => {
        if (!img) return null;

        // rimuove estensione
        const nameWithoutExt = img.replace(/\.[^/.]+$/, '');

        // prima lettera maiuscola
        const formattedName =
            nameWithoutExt.charAt(0).toUpperCase() + nameWithoutExt.slice(1);
        return `${baseUrlBanner}/${formattedName}_0.jpg`;
    };


    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: align,
                width: '100%',
            }}
        >
            {lockedChampions.map((pick, index) => {
                const isActive = index === activeIndex;

                const champToShow = pick.champ
                    ? pick.champ
                    : isActive && selectedChampion
                        ? selectedChampion
                        : null;

                const isPlaceholder = !champToShow;

                const imgSrc = champToShow
                    ? getChampionImageUrl(champToShow.img)
                    : '/img/banners/champless.png';

                return (
                    <div
                        key={index}
                        style={{
                            width: '100%',              // 🔴 riempie la col
                            aspectRatio: '21 / 9',  // mantiene proporzione
                            border: isActive ? '3px solid limegreen' : '0px solid #555',
                            boxShadow: isActive ? '0 0 5px limegreen' : 'none',
                            backgroundColor: '#333',
                            borderRadius: '3px',
                            overflow: 'hidden',
                            marginBottom: '2px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'default'
                        }}
                    >


                        <img
                            src={imgSrc}
                            alt={champToShow?.name || 'No Champion'}
                            loading="lazy"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: isPlaceholder ? 'contain' : 'cover', // mantiene proporzioni originali per champless
                                display: 'block', // 🔴 elimina spazi inline
                                transform: isPlaceholder ? 'none' : 'scale(1.8)',
                                transformOrigin: 'top'
                            }}
                        />

                    </div>

                );
            })}
        </div>
    );
}

export default PicksBanner