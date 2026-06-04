import type WebSocket from "ws";

export interface Room {
  id: string;
  players: Map<string, WebSocket>;
  playerIds: string[];
  state: "waiting" | "playing" | "finished";
}

export class RoomManager {
  private rooms = new Map<string, Room>();
  private playerRoom = new Map<WebSocket, string>();

  createRoom(): string {
    const id = this.generateId();
    const room: Room = {
      id,
      players: new Map(),
      playerIds: [],
      state: "waiting",
    };
    this.rooms.set(id, room);
    return id;
  }

  joinRoom(roomId: string, ws: WebSocket): string | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    if (room.players.size >= 2) return null;

    const playerId = `player_${room.players.size + 1}`;
    room.players.set(playerId, ws);
    room.playerIds.push(playerId);
    this.playerRoom.set(ws, roomId);

    if (room.players.size === 2) {
      room.state = "playing";
    }

    return playerId;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  getRoomByWs(ws: WebSocket): Room | undefined {
    const roomId = this.playerRoom.get(ws);
    if (!roomId) return undefined;
    return this.rooms.get(roomId);
  }

  getPlayerId(ws: WebSocket, room: Room): string | undefined {
    for (const [id, socket] of room.players) {
      if (socket === ws) return id;
    }
    return undefined;
  }

  getOpponentId(ws: WebSocket, room: Room): string | undefined {
    for (const [id, socket] of room.players) {
      if (socket !== ws) return id;
    }
    return undefined;
  }

  removePlayer(ws: WebSocket): void {
    const roomId = this.playerRoom.get(ws);
    if (!roomId) return;

    const room = this.rooms.get(roomId);
    if (!room) {
      this.playerRoom.delete(ws);
      return;
    }

    for (const [id, socket] of room.players) {
      if (socket === ws) {
        room.players.delete(id);
        room.playerIds = room.playerIds.filter((p) => p !== id);
        break;
      }
    }

    this.playerRoom.delete(ws);

    if (room.players.size === 0) {
      this.rooms.delete(roomId);
    }
  }

  removeRoom(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    for (const [, ws] of room.players) {
      this.playerRoom.delete(ws);
    }
    this.rooms.delete(roomId);
  }

  broadcast(roomId: string, message: object, exclude?: WebSocket): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const data = JSON.stringify(message);
    for (const [, ws] of room.players) {
      if (ws !== exclude && ws.readyState === ws.OPEN) {
        ws.send(data);
      }
    }
  }

  send(ws: WebSocket, message: object): void {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
