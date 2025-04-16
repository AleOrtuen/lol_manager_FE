import { CHAMP_ROLE_DELETE, CHAMP_ROLE_FIND_COMP, CHAMP_ROLE_SAVE, CHAMP_ROLE_UPDATE } from "../utils/endpoint";
import axios from "axios";

export function champRoleSave(champRole) {
    return axios.post(CHAMP_ROLE_SAVE, champRole);
}

export function champRoleUpdate(champRole) {
    return axios.put(CHAMP_ROLE_UPDATE, champRole);
}

export function champRoleDelete(idComp, idChamp, role) {
    return axios.delete(CHAMP_ROLE_DELETE, {
        params: {
            idComp: idComp,
            idChamp: idChamp,
            role: role
        }
    })
}

export function champRoleFindComp(idComp) {
    return axios.get(`${CHAMP_ROLE_FIND_COMP}${idComp}`)
}