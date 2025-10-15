import axios from "axios";
import { TEAM_ANALYSIS_CHAMP_ANALYSIS, TEAM_ANALYSIS_FIND_TEAM } from "../utils/endpoint";
import api from "./axiosInstance";

export function teamAnalysisFindTeam(idTeam) {
    return api.get(`${TEAM_ANALYSIS_FIND_TEAM}${idTeam}`);
}

export function teamAnalysisChampAnalysis(idTeam) {
    return api.get(`${TEAM_ANALYSIS_CHAMP_ANALYSIS}${idTeam}`);
}