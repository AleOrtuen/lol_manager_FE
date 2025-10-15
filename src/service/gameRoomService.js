import axios from "axios";
import { GAME_ROOM_DELETE, GAME_ROOM_FIND_ALL, GAME_ROOM_FIND_GAME, GAME_ROOM_FIND_ID, GAME_ROOM_FIND_TEAM, GAME_ROOM_SAVE, GAME_ROOM_UPDATE } from "../utils/endpoint";
import api from "./axiosInstance";

export function gameRoomSave(gameRoom) {
    return api.post(GAME_ROOM_SAVE, gameRoom);
}

export function gameRoomUpdate(gameRoom) {
    return api.put(GAME_ROOM_UPDATE, gameRoom);
}

export function gameRoomDelete(idRoom) {
    return api.delete(`${GAME_ROOM_DELETE}${idRoom}`);
}

export function gameRoomFindAll() {
    return api.get(GAME_ROOM_FIND_ALL);
}

export function gameRoomFindId(idRoom) {
    return api.get(`${GAME_ROOM_FIND_ID}${idRoom}`);
}

export function gameRoomFindGame(idGame) {
    return api.get(`${GAME_ROOM_FIND_GAME}${idGame}`);
}

export function gameRoomFindTeam(idTeam) {
    return api.get(`${GAME_ROOM_FIND_TEAM}${idTeam}`);
}