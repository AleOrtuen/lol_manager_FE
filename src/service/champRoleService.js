import { CHAMP_ROLE_DELETE, CHAMP_ROLE_FIND_COMP, CHAMP_ROLE_SAVE, CHAMP_ROLE_UPDATE } from "../utils/endpoint";
import axios from "axios";
import api from "./axiosInstance";

export function champRoleSave(champRole) {
    return api.post(CHAMP_ROLE_SAVE, champRole);
}

export function champRoleUpdate(champRole) {
    return api.put(CHAMP_ROLE_UPDATE, champRole);
}

export function champRoleDelete(idComp, idChamp, role) {
    return api.delete(CHAMP_ROLE_DELETE, {
        params: {
            idComp: idComp,
            idChamp: idChamp,
            role: role
        }
    })
}

export function champRoleFindComp(idComp) {
    return api.get(`${CHAMP_ROLE_FIND_COMP}${idComp}`)
}