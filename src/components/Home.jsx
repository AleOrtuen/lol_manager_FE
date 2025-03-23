import { useSelector, useDispatch } from "react-redux"
import Navbar from "./Navbar";
import Champions from "./Champions";

function Home() {
    const user = useSelector( (state) => state.user );
    const dispatch = useDispatch();
    return(
        <>
        <Navbar />
        <Champions />
        </>
    )
}

export default Home