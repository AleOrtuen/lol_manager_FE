import axios from "axios";
import { LEAGUE_ROLE_FIND_ALL } from "../utils/endpoint";
import api from "./axiosInstance";

export function leagueRoleFindAll() {
    return api.get(LEAGUE_ROLE_FIND_ALL);
}