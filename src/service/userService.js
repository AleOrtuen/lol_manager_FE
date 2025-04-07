import axios from "axios";
import { USER_AUTH, USER_FIND_ID, USER_FIND_TEAMS, USER_SAVE, USER_UPDATE } from "../utils/endpoint";


export function userSave(user) {
    return axios.post(USER_SAVE, user);
}

export function userUpdate(user) {
    return axios.put(USER_UPDATE, user);
}

export function userFindById(idUser) {
    return axios.get(`${USER_FIND_ID}${idUser}`)
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