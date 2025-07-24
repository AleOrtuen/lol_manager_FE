import axios from "axios";
import { TEAM_ANALYSIS_CHAMP_ANALYSIS, TEAM_ANALYSIS_FIND_TEAM } from "../utils/endpoint";

export function teamAnalysisFindTeam(idTeam) {
    return axios.get(`${TEAM_ANALYSIS_FIND_TEAM}${idTeam}`);
}

export function teamAnalysisChampAnalysis(idTeam) {
    return axios.get(`${TEAM_ANALYSIS_CHAMP_ANALYSIS}${idTeam}`);
}