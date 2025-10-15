import { useNavigate } from "react-router-dom";
import { LOGIN } from "../utils/routes";
import { useState } from "react";
import Logo from "./Logo";
import { EMAIL_REGEX } from "../utils/costanti";
import { tokenSave } from "../service/passwordResetTokenService";

function PswRequest() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Regex semplice per validazione email


    const handleKey = (e) => {
        if (e.key === "Enter") {
            resetRequest();
        }
    };

    const resetRequest = async () => {
        if (!EMAIL_REGEX.test(email)) {
            setError("Insert a valid email.");
            return;
        }
        setError("");

        await tokenSave(email).then((response) => {
            alert("We've sent you an email with instructions to reset your password.");

        }).catch(error => {
            if (error.response.status === 404) {

                setError("Insert a valid email.");
            }

            console.log(error.response.data.response);
        })
    };

    return (
        <div
            className="signup-container d-flex align-items-center justify-content-center"
            style={{ minHeight: "70vh" }}
        >
            <div className="d-flex flex-column flex-lg-row align-items-center justify-content-center gap-5 w-100 px-4">
                {/* Colonna sinistra con logo */}
                <div className="text-lg-start">
                    <div className="d-flex justify-content-center mb-4">
                        <Logo />
                    </div>
                    <h2 className="mt-4 text-center text-lg-start">PASSWORD RESET</h2>
                    <p className="mt-2 text-center text-lg-start">
                        Inserisci la tua email registrata per ricevere il link di reset.
                    </p>
                </div>

                {/* Colonna destra con form */}
                <div className="d-flex flex-column align-items-center">
                    <div
                        className="signup-box p-4 rounded shadow text-center"
                        style={{
                            backgroundColor: "rgba(0,0,0,0.7)",
                            minWidth: "300px",
                            maxWidth: "350px",
                        }}
                    >
                        <h4 className="mb-4">Reset request</h4>
                        <form>
                            <div className="form-floating mb-2">
                                <input
                                    className="form-control"
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={email}
                                    placeholder="Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={handleKey}
                                    style={{
                                        borderColor: email
                                            ? EMAIL_REGEX.test(email)
                                                ? "green"
                                                : "red"
                                            : "",
                                        borderWidth: email ? "3px" : "0",
                                    }}
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                        </form>
                        <div className={`error-msg ${!error ? 'hidden' : ''}`}
                            style={{ color: "red" }}
                        >
                            {error}
                        </div>

                        <button
                            className="btn btn-purple w-100 fw-bold"
                            onClick={resetRequest}
                        >
                            Submit
                        </button>

                        <div className="mt-3">
                            <span
                                className="text-warning"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(LOGIN)}
                            >
                                Back to home page
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PswRequest;
