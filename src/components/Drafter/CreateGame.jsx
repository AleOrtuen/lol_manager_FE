import { useState } from "react"
import { gameSave } from "../../service/gameService";
import { gameRoomSave } from "../../service/gameRoomService";

function CreateGame() {
    const baseUrl = import.meta.env.VITE_FRONTEND_BASE_URL;
    const [form, setForm] = useState({
        style: 'bo1',
        fearless: false
    });

    const [room, setRoom] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const createGame = async () => {
        let gameRoom = {
            game: {}
        };
        const gameForm = {
            style: form.style,
            fearless: form.fearless
        };

        await gameSave(gameForm)
            .then((response) => {
                gameRoom.game = response.data.objResponse;
            })
            .catch(error => {
                console.log(error.response.data.response);
                alert('Errore nella creazione del game');
            })

        await gameRoomSave(gameRoom)
            .then((response) => {
                setRoom(response.data.objResponse);
            })
            .catch(error => {
                alert('Errore nella creazione della stanza');
                console.log(error.response.data.response);
            })
    }
    return (
        <div className="d-flex align-items-center justify-content-center">
            <div className="col-10 col-md-6 text-center">
                <h1 className="display-6">CREATE GAME</h1>
                <br />
                <h5 className="fw-bolder">Draft type</h5>
                <form>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="style"
                            id="radioBo1"
                            value="bo1"
                            checked={form.style === 'bo1'}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="radioBo1">
                            BO1
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="style"
                            id="radioBo3"
                            value="bo3"
                            checked={form.style === 'bo3'}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="radioBo3">
                            BO3
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="style"
                            id="radioBo5"
                            value="bo5"
                            checked={form.style === 'bo5'}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="radioBo5">
                            BO5
                        </label>
                    </div>

                    <br /><br />

                    <div className="form-check form-switch d-flex justify-content-center">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkNativeSwitch"
                            name="fearless"
                            checked={form.fearless}
                            onChange={handleChange}
                        />
                        <label className="form-check-label ms-2" htmlFor="checkNativeSwitch">
                            Fearless
                        </label>
                    </div>
                </form>

                <br />

                <button
                    className="btn btn-secondary btn-lg"
                    onClick={() => createGame()}
                >
                    Create game
                </button>
                <br /><br />
                {room && (
                    <div className="mt-4 text-start">
                        <div className="mb-3">
                            <label className="form-label fw-bold">Your link:</label>
                            <div className="input-group">
                                <a
                                    href={`${baseUrl}${room.player1Link}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="form-control text-decoration-none text-primary"
                                >
                                    {`${baseUrl}${room.player1Link}`}
                                </a>
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => navigator.clipboard.writeText(`${baseUrl}${room.player1Link}`)}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Opponent link:</label>
                            <div className="input-group">
                                <a
                                    href={`${baseUrl}${room.player2Link}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="form-control text-decoration-none text-primary"
                                >
                                    {`${baseUrl}${room.player2Link}`}
                                </a>
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => navigator.clipboard.writeText(`${baseUrl}${room.player2Link}`)}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>

        </div>

    );
}

export default CreateGame;
