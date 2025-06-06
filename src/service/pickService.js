import axios from "axios";
import { PICK_FIND_DRAFT } from "../utils/endpoint";

export function pickFindByDraft(idDraft) {
    return axios.get(`${PICK_FIND_DRAFT}${idDraft}`);
}