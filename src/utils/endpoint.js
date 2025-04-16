const BASE_PATH = import.meta.env.VITE_API_BASE_URL;

//ENDPOINT USER
const USER_PATH = BASE_PATH + 'user/';
export const USER_SAVE = USER_PATH + 'save';
export const USER_UPDATE = USER_PATH + 'update';
export const USER_ADMIN = USER_PATH + 'admin-permit/';
export const USER_DELETE = USER_PATH + 'delete/';
export const USER_FIND_ALL = USER_PATH + 'find-all';
export const USER_FIND_ID = USER_PATH + 'find-id/';
export const USER_FIND_EMAIL = USER_PATH + 'find-email/';
export const USER_FIND_TEAMS = USER_PATH + 'find-teams/';
export const USER_AUTH = USER_PATH + 'auth';

//ENDPOINT CHAMPION
const CHAMPION_PATH = BASE_PATH + 'champ/';
export const CHAMP_SAVE = CHAMPION_PATH + 'save';
export const CHAMP_UPDATE = CHAMPION_PATH + 'update';
export const CHAMP_DELETE = CHAMPION_PATH + 'delete/';
export const CHAMP_FIND_ALL = CHAMPION_PATH + 'find-all';
export const CHAMP_FIND_ID = CHAMPION_PATH + 'find-id/';
export const CHAMP_FIND_NAME = CHAMPION_PATH + 'find-name/';
export const CHAMP_FIND_COMP = CHAMPION_PATH + 'find-comp/';

//ENDPOINT CHAMPION POOL
const CHAMP_POOL_PATH = BASE_PATH + 'champ-pool/';
export const CHAMP_POOL_SAVE = CHAMP_POOL_PATH + 'save';
export const CHAMP_POOL_DELETE = CHAMP_POOL_PATH + 'delete';
export const CHAMP_POOL_FIND_ALL = CHAMP_POOL_PATH + 'find-all';
export const CHAMP_POOL_FIND_ID = CHAMP_POOL_PATH + 'find-id';
export const CHAMP_POOL_FIND_USER = CHAMP_POOL_PATH + 'find-user/';
export const CHAMP_POOL_FIND_CHAMP = CHAMP_POOL_PATH + 'find-champ/';

//ENDPOINT TEAM
const TEAM_PATH = BASE_PATH + 'team/';
export const TEAM_SAVE = TEAM_PATH + 'save';
export const TEAM_UPDATE = TEAM_PATH + 'update';
export const TEAM_DELETE = TEAM_PATH + 'delete/';
export const TEAM_FIND_ALL = TEAM_PATH + 'find-all';
export const TEAM_FIND_ID = TEAM_PATH + 'find-id/'; 
export const TEAM_FIND_NAME = TEAM_PATH + 'find-name/';
export const TEAM_FIND_TAG = TEAM_PATH + 'find-tag/';
export const TEAM_FIND_MEMBERS = TEAM_PATH + 'find-members/';
export const TEAM_FIND_CHAMPS = TEAM_PATH + 'find-champs/';
export const TEAM_CHAMPS_COMPS = TEAM_PATH + 'champs-comps/';
export const TEAM_COMBINATOR = TEAM_PATH + 'combinator';

//ENDPOINT TEAM MEMBER
const TEAM_MEMBER_PATH = BASE_PATH + 'team-member/';
export const TEAM_MEMBER_SAVE = TEAM_MEMBER_PATH + 'save';
export const TEAM_MEMBER_DELETE = TEAM_MEMBER_PATH + 'delete';
export const TEAM_MEMBER_FIND_ALL = TEAM_MEMBER_PATH + 'find-all';
export const TEAM_MEMBER_FIND_ID = TEAM_MEMBER_PATH + 'find-id'; 
export const TEAM_MEMBER_FIND_USER = TEAM_MEMBER_PATH + 'find-user/';
export const TEAM_MEMBER_FIND_TEAM = TEAM_MEMBER_PATH + 'find-team/';

//ENDPOINT TEAM COMP
const TEAM_COMP_PATH = BASE_PATH + 'team-comp/';
export const TEAM_COMP_SAVE = TEAM_COMP_PATH + 'save';
export const TEAM_COMP_UPDATE = TEAM_COMP_PATH + 'update';
export const TEAM_COMP_DELETE = TEAM_COMP_PATH + 'delete/';
export const TEAM_COMP_FIND_ALL = TEAM_COMP_PATH + 'find-all';
export const TEAM_COMP_FIND_ID = TEAM_COMP_PATH + 'find-id/'; 
export const TEAM_COMP_FIND_TEAM = TEAM_COMP_PATH + 'find-team/';
export const TEAM_COMP_FIND_NAME = TEAM_COMP_PATH + 'find-name/';

//ENDPOINT CHAMPION ROLE
const CHAMP_ROLE_PATH = BASE_PATH + 'champ-role/';
export const CHAMP_ROLE_SAVE = CHAMP_ROLE_PATH + 'save';
export const CHAMP_ROLE_UPDATE = CHAMP_ROLE_PATH + 'update';
export const CHAMP_ROLE_DELETE = CHAMP_ROLE_PATH + 'delete';
export const CHAMP_ROLE_FIND_ALL = CHAMP_ROLE_PATH + 'find-all';
export const CHAMP_ROLE_FIND_ID = CHAMP_ROLE_PATH + 'find-id';
export const CHAMP_ROLE_FIND_COMP = CHAMP_ROLE_PATH + 'find-comp/';
export const CHAMP_ROLE_FIND_CHAMP = CHAMP_ROLE_PATH + 'find-champ/';
export const CHAMP_ROLE_FIND_ROLE = CHAMP_ROLE_PATH + 'find-role/';
export const CHAMP_ROLE_FIND_COMPATIBLE = CHAMP_ROLE_PATH + 'compatible-champs';
