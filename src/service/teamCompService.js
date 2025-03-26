import axios from "axios";
import { TEAM_COMP_FIND_TEAM } from "../utils/endpoint";

export function teamCompFindTeam(idTeam) {
    return axios.get(`${TEAM_COMP_FIND_TEAM}${idTeam}`);
}