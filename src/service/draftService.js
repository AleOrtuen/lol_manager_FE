import axios from "axios";
import { DRAFT_DELETE, DRAFT_FIND_ALL, DRAFT_FIND_GAME, DRAFT_FIND_ID, DRAFT_FIND_ROOM, DRAFT_FIND_TEAM, DRAFT_SAVE, DRAFT_UPDATE, DRAFT_WINNER } from "../utils/endpoint";
import api from "./axiosInstance";

export function draftSave(draft) {
    return api.post(DRAFT_SAVE, draft);
}

export function draftUpdate(draft) {
    return api.put(DRAFT_UPDATE, draft);
}

export function draftWinner(draft) {
    return api.put(DRAFT_WINNER,draft);
}

export function draftDelete(idDraft) {
    return api.delete(`${DRAFT_DELETE}${idDraft}`);
}

export function draftFindAll() {
    return api.get(DRAFT_FIND_ALL);
}

export function draftFindId(idDraft) {
    return api.get(`${DRAFT_FIND_ID}${idDraft}`);
}

export function draftFindTeam(idTeam) {
    return api.get(`${DRAFT_FIND_TEAM}${idTeam}`);
}

export function draftFindGame(idGame) {
    return api.get(`${DRAFT_FIND_GAME}${idGame}`);
}

export function draftFindRoom(idRoom) {
    return api.get(`${DRAFT_FIND_ROOM}${idRoom}`);
}

