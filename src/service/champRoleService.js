import { CHAMP_ROLE_FIND_COMP, CHAMP_ROLE_SAVE } from "../utils/endpoint";
import axios from "axios";

export function champRoleSave(champRole) {
    return axios.post(CHAMP_ROLE_SAVE, champRole);
}

export function champRoleFindComp(idComp) {
    return axios.get(`${CHAMP_ROLE_FIND_COMP}${idComp}`)
}