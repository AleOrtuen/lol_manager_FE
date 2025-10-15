import axios from "axios";
import { TEAM_MEMBER_DELETE, TEAM_MEMBER_DELETE_TEAM, TEAM_MEMBER_FIND_ALL, TEAM_MEMBER_FIND_TEAM, TEAM_MEMBER_FIND_USER, TEAM_MEMBER_SAVE, TEAM_MEMBER_UPDATE } from "../utils/endpoint";
import api from "./axiosInstance";

export function teamMemberSave(teamMember) {
    return api.post(TEAM_MEMBER_SAVE, teamMember);
}

export function teamMemberUpdate(teamMember) {
    return api.put(TEAM_MEMBER_UPDATE, teamMember);
}

export function teamMemberDelete(idUser, idTeam) {
    return api.delete(TEAM_MEMBER_DELETE, {
        params: {
            idUser: idUser,
            idTeam: idTeam
        }
    });
}

export function teamMemberDeleteTeam(idTeam) {
    return api.delete(`${TEAM_MEMBER_DELETE_TEAM}${idTeam}`);
}

export function teamMemberFindAll() {
    return api.get(TEAM_MEMBER_FIND_ALL);
}

export function teamMemberFindTeam(idTeam) {
    return api.get(`${TEAM_MEMBER_FIND_TEAM}${idTeam}`);
}

export function teamMemberFindUser(idUser) {
    return api.get(`${TEAM_MEMBER_FIND_USER}${idUser}`);
}