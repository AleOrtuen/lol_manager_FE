import axios from "axios";
import { TEAM_COMBINATOR, TEAM_DELETE, TEAM_FIND_ALL, TEAM_FIND_CHAMPS, TEAM_FIND_MEMBERS, TEAM_SAVE, TEAM_UPDATE } from "../utils/endpoint";

export function teamSave(team) {
    return axios.post(TEAM_SAVE, team);
}

export function teamUpdate(team) {
    return axios.put(TEAM_UPDATE, team);
}

export function teamDelete(idTeam) {
    return axios.delete(`${TEAM_DELETE}${idTeam}`);
}

export function teamFindAll() {
    return axios.get(TEAM_FIND_ALL);
}

export function teamFindMembers(idTeam) {
    return axios.get(`${TEAM_FIND_MEMBERS}${idTeam}`);
}

export function teamFindChamps(idTeam) {
    return axios.get(`${TEAM_FIND_CHAMPS}${idTeam}`);
}

export function teamCombinator(request) {
    return axios.post(TEAM_COMBINATOR, request);
}

