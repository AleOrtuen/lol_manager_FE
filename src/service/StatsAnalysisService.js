import {CHAMP_ANALYSIS_FOLDER, DRAFTS_ANALYSIS_FOLDER, TEAM_ANALYSIS_CHAMP_ANALYSIS} from "../utils/endpoint.js";
import api from "./axiosInstance";

export function champAnalysisFindFolder(idGameFolder) {
    return api.get(`${CHAMP_ANALYSIS_FOLDER}${idGameFolder}`);
}

export function draftsAnalysisFindFolder(idGameFolder) {
    return api.get(`${DRAFTS_ANALYSIS_FOLDER}${idGameFolder}`);
}