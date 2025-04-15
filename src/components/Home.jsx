import { useSelector, useDispatch } from "react-redux"
import Navbar from "./Navbar";
import Champions from "./Champions";

function Home() {
    const user = useSelector( (state) => state.user );

    return(
        <>
            <header className="bg-gray bg-gradient text-white">
                <Navbar />
                <div className="row justify-content-center">
                    <div className="col-10 ">
                        <p>
                            Benvenuto {user.username} nella versione alpha di LoL Team Manager!
                            Con LoL manager potrai facilmente gestire la tua lista di campioni giocabili, 
                            creare team e progettare le tue strategie.
                            Lo strumento Comp builder ti aiuterà nel drafting così da ottenere il miglior risultato 
                            possibile nel combinare i campioni del tuo team!
                        </p>
                        <p>Funzionalità principali:</p>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Home