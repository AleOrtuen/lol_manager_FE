const BASEPATH = 'http://localhost:8080/'

//ENDPOINT USER
const USERPATH = BASEPATH + 'user/';
export const USER_SAVE = USERPATH + 'save';
export const USER_UPDATE = USERPATH + 'update';
export const USER_ADMIN = USERPATH + 'admin-permit/';
export const USER_DELETE = USERPATH + 'delete/';
export const USER_FIND_ALL = USERPATH + 'find-all';
export const USER_FIND_ID = USERPATH + 'find-id/';
export const USER_FIND_EMAIL = USERPATH + 'find-email/';
export const USER_FIND_TEAMS = USERPATH + 'find-teams/';
export const USER_AUTH = USERPATH + 'auth';

//ENDPOINT TEAM
const TEAMPATH = BASEPATH + 'team/';
export const TEAM_SAVE = TEAMPATH + 'save';
export const TEAM_UPDATE = TEAMPATH + 'update';
export const TEAM_DELETE = TEAMPATH + 'delete/';
export const TEAM_FIND_ALL = TEAMPATH + 'find-all';
export const TEAM_FIND_ID = TEAMPATH + 'find-id/'; 
export const TEAM_FIND_NAME = TEAMPATH + 'find-name/';
export const TEAM_FIND_TAG = TEAMPATH + 'find-tag/';
export const TEAM_FIND_CHAMPS = TEAMPATH + 'find-champs/';
export const TEAM_CHAMPS_COMPS = TEAMPATH + 'champs-comps/';
export const TEAM_COMBINATOR = TEAMPATH + 'combinator';

//ENDPOINT TEAM MEMBER
const TEAMMEMBERPATH = BASEPATH + 'team-member/';
export const TEAM_MEMBER_SAVE = TEAMMEMBERPATH + 'save';
export const TEAM_MEMBER_DELETE = TEAMMEMBERPATH + 'delete/';
export const TEAM_MEMBER_FIND_ALL = TEAMMEMBERPATH + 'find-all';
export const TEAM_MEMBER_FIND_ID = TEAMMEMBERPATH + 'find-id'; 
export const TEAM_MEMBER_FIND_USER = TEAMMEMBERPATH + 'find-user/';
export const TEAM_MEMBER_FIND_TEAM = TEAMMEMBERPATH + 'find-team/';
