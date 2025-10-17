import axios from "axios";
import { TEAM_COMP_DELETE, TEAM_COMP_FIND_TEAM, TEAM_COMP_SAVE } from "../utils/endpoint";
import api from "./axiosInstance";

export function teamCompSave(comp) {
    return api.post(TEAM_COMP_SAVE, comp);
}

export function teamCompDelete(idComp) {
    return api.delete(`${TEAM_COMP_DELETE}${idComp}`);
}

export function teamCompFindTeam(idTeam) {
    return api.get(`${TEAM_COMP_FIND_TEAM}${idTeam}`);
}