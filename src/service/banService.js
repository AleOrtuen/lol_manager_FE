import { BAN_FIND_DRAFT } from "../utils/endpoint";
import axios from "axios";
import api from "./axiosInstance";

export function banFindByDraft(idDraft) {
    return api.get(`${BAN_FIND_DRAFT}${idDraft}`);
}
