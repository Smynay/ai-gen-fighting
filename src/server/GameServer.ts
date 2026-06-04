import { WebSocketServer, WebSocket } from "ws";
import {
  GameController,
  GameMode,
  GamePhase,
} from "../core/GameController";
import { ActorId, ActorStatus } from "../core/actor";
import { RoomManager } from "./RoomManager";
import { WS_MSG_CLIENT, WS_MSG_SERVER } from "./types";

const PORT = parseInt(process.env.PORT ?? "3000", 10);

export class GameServer {
  private wss: WebSocketServer;
  private rooms: RoomManager;
  private roomControllers = new Map<string, GameController>();
  private roomPresets = new Map<string, Map<string, string>>();

  constructor() {
    this.wss = new WebSocketServer({ port: PORT });
    this.rooms = new RoomManager();

    this.wss.on("connection", (ws) => {
      ws.on("message", (data) => this.handleMessage(ws, data.toString()));
      ws.on("close", () => this.handleDisconnect(ws));
    });

    console.log(`Game server listening on port ${PORT}`);
  }

  private handleMessage(ws: WebSocket, raw: string): void {
    let msg: { type: string; payload?: Record<string, unknown> };
    try {
      msg = JSON.parse(raw);
    } catch {
      this.send(ws, { type: WS_MSG_SERVER.ERROR, payload: { message: "Invalid JSON" } });
      return;
    }

    switch (msg.type) {
      case WS_MSG_CLIENT.CREATE_ROOM:
        this.handleCreateRoom(ws);
        break;
      case WS_MSG_CLIENT.JOIN_ROOM:
        this.handleJoinRoom(ws, msg.payload as any);
        break;
      case WS_MSG_CLIENT.SELECT_PRESET:
        this.handleSelectPreset(ws, msg.payload as any);
        break;
      case WS_MSG_CLIENT.SELECT_ACTION:
        this.handleSelectAction(ws, msg.payload as any);
        break;
      case WS_MSG_CLIENT.REMATCH:
        this.handleRematch(ws);
        break;
      case WS_MSG_CLIENT.LEAVE:
        this.handleLeave(ws);
        break;
      default:
        this.send(ws, { type: WS_MSG_SERVER.ERROR, payload: { message: "Unknown message type" } });
    }
  }

  private handleCreateRoom(ws: WebSocket): void {
    const roomId = this.rooms.createRoom();
    const playerId = this.rooms.joinRoom(roomId, ws);

    if (!playerId) return;

    this.send(ws, {
      type: WS_MSG_SERVER.ROOM_CREATED,
      payload: { roomId, playerId },
    });
  }

  private handleJoinRoom(ws: WebSocket, payload?: { roomId?: string }): void {
    if (!payload?.roomId) {
      this.send(ws, { type: WS_MSG_SERVER.ERROR, payload: { message: "Room ID required" } });
      return;
    }

    const playerId = this.rooms.joinRoom(payload.roomId, ws);
    if (!playerId) {
      this.send(ws, { type: WS_MSG_SERVER.ERROR, payload: { message: "Room not found or full" } });
      return;
    }

    this.send(ws, {
      type: WS_MSG_SERVER.ROOM_JOINED,
      payload: { roomId: payload.roomId, playerId },
    });

    this.rooms.broadcast(payload.roomId, {
      type: WS_MSG_SERVER.OPPONENT_JOINED,
    });

    this.startGame(payload.roomId);
  }

  private startGame(roomId: string): void {
    const room = this.rooms.getRoom(roomId);
    if (!room || room.players.size < 2) return;

    const controller = new GameController({
      onStateChange: (info) => {
        this.rooms.broadcast(roomId, {
          type: WS_MSG_SERVER.GAME_STATE,
          payload: info as any,
        });

        if (info.phase === GamePhase.WAITING_FOR_ACTION) {
          this.requestActions(roomId);
        }

        if (info.phase === GamePhase.ACTION_RESULT || info.phase === GamePhase.ROUND_RESULT) {
          setTimeout(() => {
            controller.proceedAfterResult();
          }, 1500);
        }
      },
    });

    this.roomControllers.set(roomId, controller);
    this.roomPresets.set(roomId, new Map());

    const [id1, id2] = room.playerIds;
    if (!id1 || !id2) return;

    controller.start(GameMode.PvP);
    this.requestPresets(roomId);
  }

  private requestPresets(roomId: string): void {
    const room = this.rooms.getRoom(roomId);
    if (!room) return;

    for (const [playerId, ws] of room.players) {
      this.rooms.send(ws, {
        type: WS_MSG_SERVER.PRESET_REQUEST,
        payload: { playerId },
      });
    }
  }

  private requestActions(roomId: string): void {
    const room = this.rooms.getRoom(roomId);
    if (!room) return;

    for (const [playerId, ws] of room.players) {
      this.rooms.send(ws, {
        type: WS_MSG_SERVER.ACTION_REQUEST,
        payload: { playerId, allowedActions: ["attack", "block", "dodge", "rest"] },
      });
    }
  }

  private handleSelectPreset(ws: WebSocket, payload?: { preset?: string }): void {
    const room = this.rooms.getRoomByWs(ws);
    if (!room || !payload?.preset) return;

    const playerId = this.rooms.getPlayerId(ws, room);
    if (!playerId) return;

    const presets = this.roomPresets.get(room.id);
    if (!presets) return;

    presets.set(playerId, payload.preset);

    const controller = this.roomControllers.get(room.id);
    if (!controller) return;

    const actorId = playerId === room.playerIds[0] ? ActorId.FIRST : ActorId.SECOND;
    controller.selectPreset(actorId, payload.preset as any);
  }

  private handleSelectAction(ws: WebSocket, payload?: { action?: string }): void {
    const room = this.rooms.getRoomByWs(ws);
    if (!room || !payload?.action) return;

    const playerId = this.rooms.getPlayerId(ws, room);
    if (!playerId) return;

    const controller = this.roomControllers.get(room.id);
    if (!controller) return;

    const actorId = playerId === room.playerIds[0] ? ActorId.FIRST : ActorId.SECOND;
    controller.selectAction(actorId, payload.action as ActorStatus);
  }

  private handleRematch(ws: WebSocket): void {
    const room = this.rooms.getRoomByWs(ws);
    if (!room) return;

    this.roomControllers.delete(room.id);
    this.roomPresets.delete(room.id);
    this.startGame(room.id);
  }

  private handleLeave(ws: WebSocket): void {
    const room = this.rooms.getRoomByWs(ws);
    if (room) {
      this.rooms.broadcast(room.id, {
        type: WS_MSG_SERVER.OPPONENT_DISCONNECTED,
      });
    }
    this.rooms.removePlayer(ws);
  }

  private handleDisconnect(ws: WebSocket): void {
    this.handleLeave(ws);
  }

  private send(ws: WebSocket, message: object): void {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }
}
