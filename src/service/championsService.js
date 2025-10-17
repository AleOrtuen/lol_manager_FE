import axios from "axios";
import { CHAMP_FIND_ALL } from "../utils/endpoint";
import api from "./axiosInstance";

export function champFindAll() {
    return api.get(CHAMP_FIND_ALL);
}