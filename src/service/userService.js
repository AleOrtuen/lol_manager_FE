import axios from "axios";
import { USER_AUTH, USER_FIND_EMAIL, USER_FIND_ID, USER_FIND_TEAMS, USER_SAVE, USER_UPDATE } from "../utils/endpoint";
import api from "./axiosInstance";


export function userSave(user) {
    return api.post(USER_SAVE, user);
}

export function userUpdate(user) {
    return api.put(USER_UPDATE, user);
}

export function userFindById(idUser) {
    return api.get(`${USER_FIND_ID}${idUser}`);
}

export function userFindByEmail(email) {
    return api.get(`${USER_FIND_EMAIL}${email}`);
}

export function userFindTeams(idUser) {
    return api.get(`${USER_FIND_TEAMS}${idUser}`);
}

export function userAuth(email, password) {
    return api.get(USER_AUTH, {
        params: {
            email: email,
            password: password
        }
    });
}