import { CHAMP_POOL_DELETE, CHAMP_POOL_SAVE } from "../utils/endpoint";
import axios from "axios";
import api from "./axiosInstance";

export function champPoolSave(champPool) {
    return api.post(CHAMP_POOL_SAVE, champPool);
}

export function champPoolDelete(idUser, idChamp) {
    return api.delete(CHAMP_POOL_DELETE, {
        params: {
            idUser: idUser,
            idChamp: idChamp
        }
    })
}