import { useSelector, useDispatch } from "react-redux"
import Navbar from "./Navbar";

function Home() {
    const user = useSelector( (state) => state.user );

    return(
        <>
            <header className="bg-gray bg-gradient text-white">
                <Navbar />
                <div className="row justify-content-center">
                    <div className="col-10 text-start">
                        <h4 className="text-center">
                            Benvenuto <b>{user.username}</b> nella versione alpha di LoL Team Manager!<br/>
                        </h4><br/>
                        <p>
                            Potrai facilmente gestire la tua lista di campioni giocabili, 
                            creare team e progettare le tue strategie.
                            Lo strumento Comp builder ti aiuterà nel drafting così da ottenere il miglior risultato 
                            possibile nel combinare i campioni del tuo team!
                        </p>
                        <p>Funzionalità principali:</p>
                        <p>
                            Da <b>"Il mio account"</b> puoi gestire i tuoi dati e ruolo giocatore.<br/> 
                            Inoltre puoi accedere alla <b>"Champion pool"</b> per gestire i campioni da te giocabili.
                        </p>
                        <br />
                        <p>
                            Dal <b>"Profilo"</b> del tuo team puoi accedere ai dati, modificarli e visualizzare tutti campioni giocabili dai giocatori.<br/>
                            Da <b>"Team comp"</b> puoi creare le tue strategie, eliminarle e modificare i campioni giocabili cliccando sul pulsante <b>"Info"</b>.<br/>
                            Nella specifica pagina della team comp potrai assegnare i ruoli ai campioni.<br/>
                            Con la tab di ricerca <b>"ALL"</b> visualizzerai tutti i campioni del team, invece cliccando sulle icone dei ruoli visualizzerai i campioni già assegnati alla strategia.<br/>
                            Puoi cliccare su un campione già assegnato a un ruolo per vederne le informazioni, modificarle o eliminarlo.
                        </p>
                        <br />
                        <p>
                            <b>"Comp builder"</b> userà i dati delle tue team comp e ti aiuterà nella fase di drafting pre-partita combinando i campioni che selezioni e aggiornando la lista dei compatibili.<br/>
                            Cliccando sul campione selezionato avrai una visualizzazione di tutte le possibili versioni giocabili.
                        </p><br />
                        <p>
                            Gli admin da <b>"Gestione teams"</b> possono visualizzare tutti i team, crearli ed eliminarli.
                        </p>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Home