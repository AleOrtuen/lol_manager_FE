import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TEAM, COMP_BUILDER, TEAM_COMP, TEAM_FORM, TEAMS, CHAMP_DATA, TEAM_GAMES } from "../utils/routes";
import teamIcon from '../img/team_icon.png';

function TeamsSidebar({ isOpen, onClose }) {
    const [dropdownOpen, setDropdownOpen] = useState({});
    const teams = useSelector((state) => state.team);
    const navigate = useNavigate();

    const toggleDropdown = (key) => {
        setDropdownOpen(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleNavigation = (path, idTeam = null) => {
        if (idTeam) {
            navigate(path, { state: { idTeam } });
        } else {
            navigate(path);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1040
                }}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '320px',
                    height: '100vh',
                    backgroundColor: '#212529',
                    zIndex: 1050,
                    overflowY: 'auto',
                    boxShadow: '-2px 0 10px rgba(0,0,0,0.3)',
                    transition: 'transform 0.3s ease-in-out'
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: '20px',
                        borderBottom: '1px solid #495057',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <h5 style={{ color: '#fff', margin: 0 }}>
                        <img
                            src={teamIcon}
                            style={{
                                width: '24px',
                                height: '24px',
                                marginRight: '10px'
                            }}
                            alt="Team icon"
                        />
                        Teams
                    </h5>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: 0,
                            lineHeight: 1
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '15px' }}>
                    {/* Gestione Teams Section */}
                    <div
                        style={{
                            marginBottom: '20px',
                            paddingBottom: '15px',
                            borderBottom: '2px solid #495057'
                        }}
                    >
                        <h6 style={{ color: '#adb5bd', fontSize: '12px', textTransform: 'uppercase', marginBottom: '10px', paddingLeft: '5px' }}>
                            Gestione Teams
                        </h6>
                        
                        {/* Crea Team */}
                        <a
                            onClick={() => handleNavigation(TEAM_FORM)}
                            style={{
                                display: 'block',
                                padding: '12px 15px',
                                color: '#adb5bd',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                borderRadius: '6px',
                                marginBottom: '8px',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#343a40';
                                e.currentTarget.style.color = '#fff';
                                e.currentTarget.style.paddingLeft = '20px';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#adb5bd';
                                e.currentTarget.style.paddingLeft = '15px';
                            }}
                        >
                            <i class="bi bi-plus-circle-fill"></i> Create Team
                        </a>

                        {/* Lista Teams */}
                        <a
                            onClick={() => handleNavigation(TEAMS)}
                            style={{
                                display: 'block',
                                padding: '12px 15px',
                                color: '#adb5bd',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                borderRadius: '6px',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#343a40';
                                e.currentTarget.style.color = '#fff';
                                e.currentTarget.style.paddingLeft = '20px';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#adb5bd';
                                e.currentTarget.style.paddingLeft = '15px';
                            }}
                        >
                            <i class="bi bi-list-ul"></i> Teams List
                        </a>
                    </div>

                    {/* I Miei Teams Section */}
                    {teams && teams.length > 0 && (
                        <>
                            <h6 style={{ color: '#adb5bd', fontSize: '12px', textTransform: 'uppercase', marginBottom: '10px', paddingLeft: '5px' }}>
                                My Teams
                            </h6>
                            {teams.map((team) => (
                                <div
                                    key={team.idTeam}
                                    style={{
                                        marginBottom: '15px',
                                        backgroundColor: '#343a40',
                                        borderRadius: '8px',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {/* Team Header */}
                                    <div
                                        onClick={() => toggleDropdown(team.idTeam)}
                                        style={{
                                            padding: '15px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#495057'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <span style={{ color: '#fff', fontWeight: 'bold' }}>
                                            {team.tag}
                                        </span>
                                        <span style={{ color: '#adb5bd', fontSize: '18px' }}>
                                            {dropdownOpen[team.idTeam] ? <i className="bi bi-caret-down-fill" /> : <i className="bi bi-caret-right-fill" />}
                                        </span>
                                    </div>

                                    {/* Team Menu Items */}
                                    {dropdownOpen[team.idTeam] && (
                                        <div style={{ backgroundColor: '#2c3136' }}>
                                            <a
                                                onClick={() => handleNavigation(TEAM, team.idTeam)}
                                                style={{
                                                    display: 'block',
                                                    padding: '12px 20px',
                                                    color: '#adb5bd',
                                                    textDecoration: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#495057';
                                                    e.currentTarget.style.color = '#fff';
                                                    e.currentTarget.style.paddingLeft = '25px';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.color = '#adb5bd';
                                                    e.currentTarget.style.paddingLeft = '20px';
                                                }}
                                            >
                                                <i class="bi bi-people-fill"></i> Profile
                                            </a>
                                            <a
                                                onClick={() => handleNavigation(TEAM_COMP, team.idTeam)}
                                                style={{
                                                    display: 'block',
                                                    padding: '12px 20px',
                                                    color: '#adb5bd',
                                                    textDecoration: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#495057';
                                                    e.currentTarget.style.color = '#fff';
                                                    e.currentTarget.style.paddingLeft = '25px';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.color = '#adb5bd';
                                                    e.currentTarget.style.paddingLeft = '20px';
                                                }}
                                            >
                                                <i class="bi bi-fire"></i> Team Strategies
                                            </a>
                                            <a
                                                onClick={() => handleNavigation(COMP_BUILDER, team.idTeam)}
                                                style={{
                                                    display: 'block',
                                                    padding: '12px 20px',
                                                    color: '#adb5bd',
                                                    textDecoration: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#495057';
                                                    e.currentTarget.style.color = '#fff';
                                                    e.currentTarget.style.paddingLeft = '25px';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.color = '#adb5bd';
                                                    e.currentTarget.style.paddingLeft = '20px';
                                                }}
                                            >
                                                <i class="bi bi-hammer"></i> Comp Builder
                                            </a>
                                            <a
                                                onClick={() => handleNavigation(TEAM_GAMES, team.idTeam)}
                                                style={{
                                                    display: 'block',
                                                    padding: '12px 20px',
                                                    color: '#adb5bd',
                                                    textDecoration: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#495057';
                                                    e.currentTarget.style.color = '#fff';
                                                    e.currentTarget.style.paddingLeft = '25px';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.color = '#adb5bd';
                                                    e.currentTarget.style.paddingLeft = '20px';
                                                }}
                                            >
                                                <i class="bi bi-controller"></i> Games
                                            </a>
                                            <a
                                                onClick={() => handleNavigation(CHAMP_DATA, team.idTeam)}
                                                style={{
                                                    display: 'block',
                                                    padding: '12px 20px',
                                                    color: '#adb5bd',
                                                    textDecoration: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#495057';
                                                    e.currentTarget.style.color = '#fff';
                                                    e.currentTarget.style.paddingLeft = '25px';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.color = '#adb5bd';
                                                    e.currentTarget.style.paddingLeft = '20px';
                                                }}
                                            >
                                                <i class="bi bi-graph-up"></i> Champion Stats
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default TeamsSidebar;