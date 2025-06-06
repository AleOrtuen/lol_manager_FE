import { BAN_FIND_DRAFT } from "../utils/endpoint";
import axios from "axios";

export function banFindByDraft(idDraft) {
    return axios.get(`${BAN_FIND_DRAFT}${idDraft}`);
}
