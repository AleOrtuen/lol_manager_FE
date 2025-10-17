import { useSelector, useDispatch } from "react-redux"
import Navbar from "./Navbar";

function Home() {
    const user = useSelector( (state) => state.user );

return(
    <>
        <header className="bg-gray bg-gradient">
            <Navbar />
            <div className="row justify-content-center">
                <div className="col-10 text-center">
                    <h4>
                        Welcome <b>{user.username}</b> to LoL Team Manager Alpha!
                    </h4><br/>
                    <p>
                        Manage your champions, build teams, and craft winning strategies—all in one place. 
                        Simulate drafts with <b>Comp Builder</b>, track team performance, and explore detailed champion stats.
                    </p>
                    <p>
                        <b>Quick Highlights:</b><br/>
                        • View and edit team profiles with winrate stats.<br/>
                        • Create and manage team strategies with assigned champions.<br/>
                        • Track match history and champion performance.<br/>
                        • Draft interactively with other teams using our Drafter tool.
                    </p>
                    <p>
                        Take control, optimize your team, and dominate your matches!
                    </p>
                </div>
            </div>
        </header>
    </>
)


}

export default Home