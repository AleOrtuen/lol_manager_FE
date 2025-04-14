import axios from "axios";
import { TEAM_MEMBER_DELETE, TEAM_MEMBER_FIND_USER, TEAM_MEMBER_SAVE } from "../utils/endpoint";

export function teamMemberSave(teamMember) {
    return axios.post(TEAM_MEMBER_SAVE, teamMember);
}

export function teamMemberDelete(idUser, idTeam) {
    return axios.delete(TEAM_MEMBER_DELETE, {
        params: {
            idUser: idUser,
            idTeam: idTeam
        }
    });
}

export function teamMemberFindUser(idUser) {
    return axios.get(`${TEAM_MEMBER_FIND_USER}${idUser}`);
}