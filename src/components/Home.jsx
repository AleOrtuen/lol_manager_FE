import { useSelector, useDispatch } from "react-redux"
import Navbar from "./Navbar";
import Champions from "./Champions";

function Home() {
    const user = useSelector( (state) => state.user );

    return(
        <>
            <Navbar />
            <Champions champions={user.champions}/>
        </>
    )
}

export default Home