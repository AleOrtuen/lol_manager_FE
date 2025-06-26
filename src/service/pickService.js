import axios from "axios";
import { PICK_FIND_DRAFT, PICK_FIND_FEARLESS } from "../utils/endpoint";

export function pickFindByDraft(idDraft) {
    return axios.get(`${PICK_FIND_DRAFT}${idDraft}`);
}

export function pickFindByGame(idGame) {
    return axios.get(`${PICK_FIND_FEARLESS}${idGame}`);
}