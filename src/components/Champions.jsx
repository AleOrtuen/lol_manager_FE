import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function Champions() {
  const [imagesMap, setImagesMap] = useState({});
  const user = useSelector((state) => state.user);

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
      <header className="bg-gray bg-gradient text-white">
        <h2>Champion pool</h2>
        <br/>
        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center'
          }}
        >
          {/* Mostra tutti i campioni dell'utente */}
          {user.champions.map((champion, index) => (
            <div 
              key={index}
              style={{
                minWidth: '80px',
                textAlign: 'center',
              }}
            >
              {/* Verifica se l'immagine è disponibile basandosi sul nome */}
              {imagesMap[champion.name.toLowerCase()] ? (
                <img 
                  src={imagesMap[champion.name.toLowerCase()]} 
                  alt={champion.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              ) : (
                /* Mostra l'immagine dal percorso indicato nell'oggetto champion, se presente */
                champion.img ? (
                  <img 
                    src={`../img/champions/${champion.img}`} 
                    alt={champion.name}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
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
      </header>
    </div>
  );
}

export default Champions;