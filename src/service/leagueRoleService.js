import axios from "axios";
import { LEAGUE_ROLE_FIND_ALL } from "../utils/endpoint";

export function leagueRoleFindAll() {
    return axios.get(LEAGUE_ROLE_FIND_ALL);
}