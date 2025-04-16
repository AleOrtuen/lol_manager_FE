import { CHAMP_POOL_DELETE, CHAMP_POOL_SAVE } from "../utils/endpoint";
import axios from "axios";

export function champPoolSave(champPool) {
    return axios.post(CHAMP_POOL_SAVE, champPool);
}

export function champPoolDelete(idUser, idChamp) {
    return axios.delete(CHAMP_POOL_DELETE, {
        params: {
            idUser: idUser,
            idChamp: idChamp
        }
    })
}