import axios from "axios";
import { CHAMP_FIND_ALL } from "../utils/endpoint";

export function champFindAll() {
    return axios.get(CHAMP_FIND_ALL);
}