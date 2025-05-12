import axios from "axios";
import { GAME_DELETE, GAME_FIND_ALL, GAME_FIND_ID, GAME_SAVE, GAME_UPDATE } from "../utils/endpoint";

export function gameSave(game) {
    return axios.post(GAME_SAVE, game);
}

export function gameUpdate(game) {
    return axios.put(GAME_UPDATE, game);
}

export function gameDelete(idGame) {
    return axios.delete(`${GAME_DELETE}${idGame}`);
}

export function gameFindAll() {
    return axios.get(GAME_FIND_ALL);
}

export function gameFindId(idGame) {
    return axios.get(`${GAME_FIND_ID}${idGame}`);
}
