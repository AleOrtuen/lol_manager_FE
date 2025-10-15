import axios from "axios";
import { GAME_DELETE, GAME_FIND_ALL, GAME_FIND_ID, GAME_SAVE, GAME_UPDATE } from "../utils/endpoint";
import api from "./axiosInstance";

export function gameSave(game) {
    return api.post(GAME_SAVE, game);
}

export function gameUpdate(game) {
    return api.put(GAME_UPDATE, game);
}

export function gameDelete(idGame) {
    return api.delete(`${GAME_DELETE}${idGame}`);
}

export function gameFindAll() {
    return api.get(GAME_FIND_ALL);
}

export function gameFindId(idGame) {
    return api.get(`${GAME_FIND_ID}${idGame}`);
}
