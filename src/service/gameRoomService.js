import axios from "axios";
import { GAME_ROOM_DELETE, GAME_ROOM_FIND_ALL, GAME_ROOM_FIND_GAME, GAME_ROOM_FIND_ID, GAME_ROOM_SAVE, GAME_ROOM_UPDATE } from "../utils/endpoint";

export function gameRoomSave(gameRoom) {
    return axios.post(GAME_ROOM_SAVE, gameRoom);
}

export function gameRoomUpdate(gameRoom) {
    return axios.put(GAME_ROOM_UPDATE, gameRoom);
}

export function gameRoomDelete(idRoom) {
    return axios.delete(`${GAME_ROOM_DELETE}${idRoom}`);
}

export function gameRoomFindAll() {
    return axios.get(GAME_ROOM_FIND_ALL);
}

export function gameRoomFindId(idRoom) {
    return axios.get(`${GAME_ROOM_FIND_ID}${idRoom}`);
}

export function gameRoomFindGame(idGame) {
    return axios.get(`${GAME_ROOM_FIND_GAME}${idGame}`);
}
