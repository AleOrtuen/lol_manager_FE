import api from "./axiosInstance.js";
import {
    GAME_FOLDER_DELETE,
    GAME_FOLDER_FIND_ALL,
    GAME_FOLDER_FIND_ID, GAME_FOLDER_FIND_TEAM,
    GAME_FOLDER_SAVE,
    GAME_FOLDER_UPDATE
} from "../utils/endpoint.js";

export function gameFolderSave(gameFolder) {
    return api.post(GAME_FOLDER_SAVE, gameFolder);
}

export function gameFolderUpdate(gameFolder) {
    return api.put(GAME_FOLDER_UPDATE, gameFolder);
}

export function gameFolderDelete(idGameFolder) {
    return api.delete(`${GAME_FOLDER_DELETE}${idGameFolder}`);
}

export function gameFolderFindAll() {
    return api.get(GAME_FOLDER_FIND_ALL);
}

export function gameFolderFindId(idGameFolder) {
    return api.get(`${GAME_FOLDER_FIND_ID}${idGameFolder}`);
}

export function gameFolderFindTeam(idTeam) {
    return api.get(`${GAME_FOLDER_FIND_TEAM}${idTeam}`);
}