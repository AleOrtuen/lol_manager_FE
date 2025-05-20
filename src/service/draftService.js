import axios from "axios";
import { DRAFT_DELETE, DRAFT_FIND_ALL, DRAFT_FIND_GAME, DRAFT_FIND_ID, DRAFT_FIND_TEAM, DRAFT_SAVE, DRAFT_UPDATE } from "../utils/endpoint";

export function draftSave(draft) {
    return axios.post(DRAFT_SAVE, draft);
}

export function draftUpdate(draft) {
    return axios.put(DRAFT_UPDATE, draft);
}

export function draftDelete(idDraft) {
    return axios.delete(`${DRAFT_DELETE}${idDraft}`);
}

export function draftFindAll() {
    return axios.get(DRAFT_FIND_ALL);
}

export function draftFindId(idDraft) {
    return axios.get(`${DRAFT_FIND_ID}${idDraft}`);
}

export function draftFindTeam(idTeam) {
    return axios.get(`${DRAFT_FIND_TEAM}${idTeam}`);
}

export function draftFindGame(idGame) {
    return axios.get(`${DRAFT_FIND_GAME}${idGame}`);
}