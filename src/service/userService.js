import axios from "axios";
import { USER_AUTH, USER_FIND_TEAMS, USER_SAVE } from "../utils/endpoint";

export function userSave(user) {
    return axios.post(USER_SAVE, user);
}

export function userFindTeams(idUser) {
    return axios.get(`${USER_FIND_TEAMS}${idUser}`);
}

export function userAuth(email, password) {
    return axios.get(USER_AUTH, {
        params: {
            email: email,
            password: password
        }
    });
}