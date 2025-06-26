import { useEffect, useState } from 'react';

function Champions({ champions, onSelectChampion, lockedChampions = new Set(), passiveState, size }) {
  const [imagesMap, setImagesMap] = useState({});

  useEffect(() => {
    const importImages = async () => {
      const imagesContext = {};

      try {
        const championsImages = import.meta.glob('../img/champions/*.webp');

        for (const path in championsImages) {
          const championName = path.split('/').pop().replace('.webp', '');
          const imageModule = await championsImages[path]();
          imagesContext[championName.toLowerCase()] = imageModule.default;
        }

        setImagesMap(imagesContext);
      } catch (error) {
        console.error("Errore nel caricamento delle immagini:", error);
      }
    };

    importImages();
  }, []);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2px',
          justifyContent: 'center'
        }}
      >
        {champions.map((champion, index) => {
          const isLocked = lockedChampions.has(champion.idChamp);
          const imgSrc = imagesMap[champion.name.toLowerCase()] || `/img/champions/${champion.img}`;

          return (
            <div
              key={index}
              style={{
                minWidth: '67px',
                textAlign: 'center',
                cursor: isLocked || passiveState ? 'not-allowed' : 'pointer',
                filter: isLocked || passiveState ? 'grayscale(100%) brightness(0.6)' : 'none',
                pointerEvents: isLocked ? 'none' : 'auto'
              }}
              onClick={() => {
                if (!isLocked) onSelectChampion(champion);
              }}
            >
              <img
                src={imgSrc}
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
          );
        })}
      </div>
    </div>
  );
}

export default Champions;
