import axios from "axios";
import { TEAM_COMBINATOR, TEAM_DELETE, TEAM_FIND_ALL, TEAM_FIND_CHAMPS, TEAM_FIND_ID, TEAM_FIND_MEMBERS, TEAM_SAVE, TEAM_UPDATE } from "../utils/endpoint";
import api from "./axiosInstance";

export function teamSave(team, file) {
    const formData = new FormData();
    formData.append("team", JSON.stringify(team));
    if (file) {
        formData.append("file", file);
    }
    return api.post(TEAM_SAVE, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": "Basic " + btoa("admin:admin")
        }
    });
}

export function teamUpdate(team, file) {
    const formData = new FormData();
    formData.append("team", JSON.stringify(team));
    if (file) {
        formData.append("file", file);
    }
    return api.put(TEAM_UPDATE, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": "Basic " + btoa("admin:admin")
        }
    });
}

export function teamDelete(idTeam) {
    return api.delete(`${TEAM_DELETE}${idTeam}`, {
        headers: {
            "Authorization": "Basic " + btoa("admin:admin")
        }
    });
}

export function teamFindAll() {
    return api.get(TEAM_FIND_ALL);
}

export function teamFindById(idTeam) {
    return api.get(`${TEAM_FIND_ID}${idTeam}`);
}

export function teamFindMembers(idTeam) {
    return api.get(`${TEAM_FIND_MEMBERS}${idTeam}`);
}

export function teamFindChamps(idTeam) {
    return api.get(`${TEAM_FIND_CHAMPS}${idTeam}`);
}

export function teamCombinator(request) {
    return api.post(TEAM_COMBINATOR, request, {
        headers: {
            "Authorization": "Basic " + btoa("admin:admin") // 👈 aggiunto
        }
    });
}

