import { useState } from "react";
import { gameSave } from "../../service/gameService";
import { gameRoomSave } from "../../service/gameRoomService";
import { draftSave } from "../../service/draftService";
import logo from '../../img/logo.png';
import drafter from '../../img/drafter_logo.png';

function CreateGame() {
    const baseUrl = import.meta.env.VITE_FRONTEND_BASE_URL;
    const [form, setForm] = useState({ style: 'bo1', fearless: false });
    const [room, setRoom] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const createGame = async () => {
        let gameRoom = { game: {} };
        let game;
        try {
            const responseGame = await gameSave(form);
            gameRoom.game = responseGame.data.objResponse;
            game = responseGame.data.objResponse;

            const responseRoom = await gameRoomSave(gameRoom);
            setRoom(responseRoom.data.objResponse);

            await draftSave({ game });
        } catch (error) {
            console.log(error.response?.data?.response || error);
            alert('Error creating the game or room');
        }
    };

    return (
        <div className="container" style={{ paddingTop: "20px", minHeight: "70vh" }}>
            {/* Sezione principale: Logo + Box input affiancati */}
            <div className="d-flex flex-column flex-lg-row align-items-center justify-content-center gap-5 mb-5 px-4">

                {/* Logo e descrizione */}
                <div className="text-center">
                    <div className="d-flex flex-column align-items-center">
                        <img src={logo} style={{ maxWidth: '150px', marginBottom: '10px' }} alt="Logo" />
                        <img src={drafter} style={{ maxWidth: '150px', marginBottom: '20px' }} alt="Drafter" />
                    </div>
                    <p style={{ fontSize: '1rem' }}>Choose a BO1, BO3, or BO5 series.</p>
                    <p style={{ fontSize: '0.9rem', fontStyle: 'italic', maxWidth: '350px', margin: '0 auto' }}>
                        In Fearless Mode, champions picked in previous games can't be chosen again by either team.
                    </p>
                </div>

                {/* Box con selezioni */}
                <div className="d-flex flex-column align-items-center">
                    <div
                        className="login-box p-4 rounded shadow text-center"
                        style={{
                            backgroundColor: "rgba(0,0,0,0.7)",
                            minWidth: "300px",
                            maxWidth: "350px"
                        }}
                    >
                        <h4 className="fw-bold mb-4">Draft type</h4>
                        <form>
                            <div className="d-flex justify-content-center gap-4 mb-4">
                                {/* BO1 */}
                                <div
                                    className="d-flex flex-column align-items-center p-3 rounded cursor-pointer border border-3"
                                    style={{
                                        minWidth: '80px',
                                        cursor: 'pointer',
                                        borderColor: form.style === 'bo1' ? '#ffc107' : '#6c757d',
                                        backgroundColor: form.style === 'bo1' ? 'rgba(255, 193, 7, 0.1)' : 'transparent',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onClick={() => setForm(prev => ({ ...prev, style: 'bo1', fearless: false }))}
                                >
                                    <div className="d-flex gap-1 mb-2">
                                        <div
                                            className="rounded-circle bg-warning"
                                            style={{ width: '12px', height: '12px' }}
                                        ></div>
                                    </div>
                                    <strong>BO1</strong>
                                </div>

                                {/* BO3 */}
                                <div
                                    className="d-flex flex-column align-items-center p-3 rounded cursor-pointer border border-3"
                                    style={{
                                        minWidth: '80px',
                                        cursor: 'pointer',
                                        borderColor: form.style === 'bo3' ? '#ffc107' : '#6c757d',
                                        backgroundColor: form.style === 'bo3' ? 'rgba(255, 193, 7, 0.1)' : 'transparent',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onClick={() => setForm(prev => ({ ...prev, style: 'bo3' }))}
                                >
                                    <div className="d-flex gap-1 mb-2">
                                        <div
                                            className="rounded-circle bg-warning"
                                            style={{ width: '12px', height: '12px' }}
                                        ></div>
                                        <div
                                            className="rounded-circle bg-warning"
                                            style={{ width: '12px', height: '12px' }}
                                        ></div>
                                        <div
                                            className="rounded-circle bg-warning"
                                            style={{ width: '12px', height: '12px' }}
                                        ></div>
                                    </div>
                                    <strong>BO3</strong>
                                </div>

                                {/* BO5 */}
                                <div
                                    className="d-flex flex-column align-items-center p-3 rounded cursor-pointer border border-3"
                                    style={{
                                        minWidth: '80px',
                                        cursor: 'pointer',
                                        borderColor: form.style === 'bo5' ? '#ffc107' : '#6c757d',
                                        backgroundColor: form.style === 'bo5' ? 'rgba(255, 193, 7, 0.1)' : 'transparent',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onClick={() => setForm(prev => ({ ...prev, style: 'bo5' }))}
                                >
                                    <div className="d-flex gap-1 mb-2">
                                        <div
                                            className="rounded-circle bg-warning"
                                            style={{ width: '12px', height: '12px' }}
                                        ></div>
                                        <div
                                            className="rounded-circle bg-warning"
                                            style={{ width: '12px', height: '12px' }}
                                        ></div>
                                        <div
                                            className="rounded-circle bg-warning"
                                            style={{ width: '12px', height: '12px' }}
                                        ></div>
                                        <div
                                            className="rounded-circle bg-warning"
                                            style={{ width: '12px', height: '12px' }}
                                        ></div>
                                        <div
                                            className="rounded-circle bg-warning"
                                            style={{ width: '12px', height: '12px' }}
                                        ></div>
                                    </div>
                                    <strong>BO5</strong>
                                </div>
                            </div>

                            <div className="form-check form-switch d-flex justify-content-center">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="checkNativeSwitch"
                                    name="fearless"
                                    checked={form.fearless}
                                    onChange={handleChange}
                                    disabled={form.style === 'bo1'}
                                />
                                <label className="form-check-label ms-2" htmlFor="checkNativeSwitch">Fearless</label>
                            </div>
                        </form>

                        <button className="btn btn-purple btn-lg mt-3 w-100 fw-bold" onClick={createGame}>
                            CREATE GAME
                        </button>
                    </div>
                </div>
            </div>

            {/* Blocchi dei link: occupano più larghezza */}
            {room && (
                <div className="mx-auto px-4" style={{ maxWidth: "900px" }}>
                    {['player1Link', 'player2Link', 'spectateLink'].map(linkKey => (
                        <div className="mb-3" key={linkKey}>
                            <label className="form-label fw-bold">
                                {linkKey === 'player1Link' ? 'Your link:' :
                                    linkKey === 'player2Link' ? 'Opponent link:' : 'Spectate link:'}
                            </label>
                            <div className="input-group">
                                <a
                                    href={`${baseUrl}${room[linkKey]}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="form-control text-decoration-none text-primary"
                                    style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                                >
                                    {`${baseUrl}${room[linkKey]}`}
                                </a>
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => navigator.clipboard.writeText(`${baseUrl}${room[linkKey]}`)}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CreateGame;