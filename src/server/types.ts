export enum WS_MSG_CLIENT {
  CREATE_ROOM = "create_room",
  JOIN_ROOM = "join_room",
  SELECT_PRESET = "select_preset",
  SELECT_ACTION = "select_action",
  REMATCH = "rematch",
  LEAVE = "leave",
}

export enum WS_MSG_SERVER {
  ROOM_CREATED = "room_created",
  ROOM_JOINED = "room_joined",
  OPPONENT_JOINED = "opponent_joined",
  GAME_STATE = "game_state",
  ACTION_REQUEST = "action_request",
  PRESET_REQUEST = "preset_request",
  OPPONENT_DISCONNECTED = "opponent_disconnected",
  ERROR = "error",
}

export interface WSMessage {
  type: string;
  payload?: Record<string, unknown>;
}

export interface RoomInfo {
  roomId: string;
  player1Id: string;
  player2Id: string | null;
}
