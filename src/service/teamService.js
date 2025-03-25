import axios from "axios";
import { TEAM_FIND_CHAMPS, TEAM_SAVE } from "../utils/endpoint";

export function teamSave(team) {
    return axios.post(TEAM_SAVE, team);
}

export function teamFindChamps(idTeam) {
    return axios.get(`${TEAM_FIND_CHAMPS}${idTeam}`);
}