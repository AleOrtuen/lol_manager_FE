import { useSelector, useDispatch } from "react-redux"
import Navbar from "./Navbar";
import Champions from "./Champions";

function Home() {
    const user = useSelector( (state) => state.user );

    return(
        <>
            <header className="bg-gray bg-gradient text-white">
                <Navbar />
                <Champions champions={user.champions}/>
            </header>
        </>
    )
}

export default Home