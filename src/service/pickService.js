import axios from "axios";
import { PICK_FIND_DRAFT, PICK_FIND_FEARLESS } from "../utils/endpoint";
import api from "./axiosInstance";

export function pickFindByDraft(idDraft) {
    return api.get(`${PICK_FIND_DRAFT}${idDraft}`);
}

export function pickFindByGame(idGame) {
    return api.get(`${PICK_FIND_FEARLESS}${idGame}`);
}