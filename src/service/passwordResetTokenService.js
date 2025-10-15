import axios from "axios";
import { PASSWORD_RESET_TOKEN_DELETE, PASSWORD_RESET_TOKEN_FIND_TOKEN, PASSWORD_RESET_TOKEN_SAVE } from "../utils/endpoint";
import api from "./axiosInstance";

export function tokenSave(email) {
    return api.post(`${PASSWORD_RESET_TOKEN_SAVE}${email}`);
}

export function tokenFindByToken(token) {
    return api.get(`${PASSWORD_RESET_TOKEN_FIND_TOKEN}${token}`);
}

export function tokenDelete(token) {
    return api.delete(`${PASSWORD_RESET_TOKEN_DELETE}${token}`);
}