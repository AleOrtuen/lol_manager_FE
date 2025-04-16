import axios from "axios";
import { TEAM_COMP_DELETE, TEAM_COMP_FIND_TEAM, TEAM_COMP_SAVE } from "../utils/endpoint";

export function teamCompSave(comp) {
    return axios.post(TEAM_COMP_SAVE, comp);
}

export function teamCompDelete(idComp) {
    return axios.delete(`${TEAM_COMP_DELETE}${idComp}`);
}

export function teamCompFindTeam(idTeam) {
    return axios.get(`${TEAM_COMP_FIND_TEAM}${idTeam}`);
}