import { CHAMP_ROLE_FIND_COMP } from "../utils/endpoint";
import axios from "axios";

export function champRoleFindComp(idComp) {
    return axios.get(`${CHAMP_ROLE_FIND_COMP}${idComp}`)
}