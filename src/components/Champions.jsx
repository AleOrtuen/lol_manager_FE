import { useEffect, useState } from 'react';

function Champions({champions}) {
  const [imagesMap, setImagesMap] = useState({});

  useEffect(() => {
    // Crea una mappa con le immagini usando i nomi dei file
    const importImages = async () => {
      const imagesContext = {}; // Oggetto per mappare nome_campione -> url_immagine
      
      try {
        // Importa tutte le immagini disponibili
        const championsImages = import.meta.glob('../img/champions/*.webp');
        
        for (const path in championsImages) {
          const championName = path.split('/').pop().replace('.webp', '');
          const imageModule = await championsImages[path]();
          imagesContext[championName] = imageModule.default;
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
            gap: '8px',
            justifyContent: 'center'
          }}
        >
          {/* Mostra tutti i campioni dell'utente */}
          {champions.map((champion, index) => (
            <div 
              key={index}
              style={{
                minWidth: '67px',
                textAlign: 'center',
              }}
            >
              {/* Verifica se l'immagine è disponibile basandosi sul nome */}
              {imagesMap[champion.name.toLowerCase()] ? (
                <img 
                  src={imagesMap[champion.name.toLowerCase()]} 
                  alt={champion.name}
                  style={{
                    width: '67px',
                    height: '67px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                  className="image-hover"
                />
              ) : (
                /* Mostra l'immagine dal percorso indicato nell'oggetto champion, se presente */
                champion.img ? (
                  <img 
                    src={`/img/champions/${champion.img}`} 
                    alt={champion.name}
                    style={{
                      width: '67px',
                      height: '67px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                    className="image-hover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null
              )}
              {/* <p>{champion.name}</p> */}
            </div>
          ))}
        </div>
    </div>
  );
}

export default Champions;