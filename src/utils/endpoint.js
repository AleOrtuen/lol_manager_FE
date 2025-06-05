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

//ENDPOINT GAME
const GAME_PATH = BASE_PATH + 'game/';
export const GAME_SAVE = GAME_PATH + 'save';
export const GAME_UPDATE = GAME_PATH + 'update';
export const GAME_DELETE = GAME_PATH + 'delete/';
export const GAME_FIND_ALL = GAME_PATH + 'find-all';
export const GAME_FIND_ID = GAME_PATH + 'find-id/';

//ENDPOINT GAME ROOMS 
const GAME_ROOM_PATH = BASE_PATH + 'game-room/';
export const GAME_ROOM_SAVE = GAME_ROOM_PATH + 'save';
export const GAME_ROOM_UPDATE = GAME_ROOM_PATH + 'update';
export const GAME_ROOM_DELETE = GAME_ROOM_PATH + 'delete/';
export const GAME_ROOM_FIND_ALL = GAME_ROOM_PATH + 'find-all';
export const GAME_ROOM_FIND_ID = GAME_ROOM_PATH + 'find-id/';
export const GAME_ROOM_FIND_GAME = GAME_ROOM_PATH + 'find-game/';

//ENDPOINT DRAFT 
const DRAFT_PATH = BASE_PATH + 'draft/';
export const DRAFT_SAVE = DRAFT_PATH + 'save';
export const DRAFT_UPDATE = DRAFT_PATH + 'update';
export const DRAFT_DELETE = DRAFT_PATH + 'delete/';
export const DRAFT_FIND_ALL = DRAFT_PATH + 'find-all';
export const DRAFT_FIND_ID = DRAFT_PATH + 'find-id/';
export const DRAFT_FIND_TEAM = DRAFT_PATH + 'find-team/';
export const DRAFT_FIND_GAME = DRAFT_PATH + 'find-game/';
export const DRAFT_FIND_ROOM = DRAFT_PATH + 'find-room/';

//ENDPOINT PICKS
const PICK_PATH = BASE_PATH + 'pick/';
export const PICK_SAVE = PICK_PATH + 'save';
export const PICK_UPDATE = PICK_PATH + 'update';
export const PICK_DELETE = PICK_PATH + 'delete/';
export const PICK_FIND_ALL = PICK_PATH + 'find-all';
export const PICK_FIND_ID = PICK_PATH + 'find-id/';
export const PICK_FIND_DRAFT = PICK_PATH + 'find-draft/';
export const PICK_FIND_SIDE = PICK_PATH + 'find-side/';
export const PICK_FIND_CHAMP = PICK_PATH + 'find-champ/';

//ENDPOINT BANS
const BAN_PATH = BASE_PATH + 'ban/';
export const BAN_SAVE = BAN_PATH + 'save';
export const BAN_UPDATE = BAN_PATH + 'update';
export const BAN_DELETE = BAN_PATH + 'delete/';
export const BAN_FIND_ALL = BAN_PATH + 'find-all';
export const BAN_FIND_ID = BAN_PATH + 'find-id/';
export const BAN_FIND_DRAFT = BAN_PATH + 'find-draft/';
export const BAN_FIND_SIDE = BAN_PATH + 'find-side/';
export const BAN_FIND_CHAMP = BAN_PATH + 'find-champ/';