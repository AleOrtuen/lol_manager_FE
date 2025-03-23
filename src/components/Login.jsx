import { useState } from "react"
import Logo from "./Logo"
import { useNavigate } from "react-router-dom";
import { HOME, SIGNUP } from "../utils/routes";
import { userAuth } from "../service/userService";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slice/userSlice";

function Login() {

    const navigate  = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    function login() {
        if(email && email !== ''
        && password && password !== ''
        ) {
            const user = {
                email,
                password
            }

            userAuth(email, password).then( (response) => {
                console.log(response.data)
                dispatch(setUser(response.data.objResponse))
                navigate(HOME)
            }).catch( error => {
                console.log(error.response.data.response)
                alert('Credenziali errate')
            })
        } else {
            alert('Inserire email e password')
        }
    }

    // LOGIN ALLA PRESSIONE DI INVIO
    function handleKey(e) {
        if (e.key === "Enter") {
            login();
        }
    }

    return(
        <>
            <Logo />
            <div>
                <br/>
                <h5 class="fw-bolder">Login</h5>
                <br/>
                <div class="row">
                <div class="col-md-4 offset-md-4 col-sm-8 offset-sm-2">
                <form>
                <div class="form-floating mb-3">
                    <input
                        class="form-control"
                        type="text"
                        id="email" 
                        value={email} 
                        placeholder="Email" 
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKey}
                    />
                    <label htmlFor="email">Email</label> 
                </div>
                <div class="form-floating mb-3">
                    <input
                        class="form-control"
                        type="password" 
                        id="password"
                        value={password} 
                        placeholder="Password" 
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKey}
                    />
                    <label htmlFor="password">Password</label>
                    </div>
                </form>  
                <br/>
                <button class="btn btn-outline-secondary btn-lg" onClick={() => login()}>
                    Entra
                </button>
                </div>
                </div>
            </div>
            <br/>
            {/* <p> */}
                Non hai un account? 
                <a onClick={() => navigate(SIGNUP)}> Registrati!</a>

            {/* </p> */}
        </>
    )
}

export default Login