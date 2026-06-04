import { useCallback, useEffect, useRef, useState } from "react";
import { WS_MSG_CLIENT, WS_MSG_SERVER } from "../../server/types";

type MessageHandler = (type: string, payload?: Record<string, unknown>) => void;

const WS_URL = `ws://${location.hostname}:3000`;
const WS_DISABLED = import.meta.env.VITE_DISABLE_MULTIPLAYER === "true";

const noop = () => {};

export function useWebSocket(onMessage: MessageHandler) {
  if (WS_DISABLED) {
    return { connected: false, playerId: null, roomId: null, connect: noop, disconnect: noop, createRoom: noop, joinRoom: noop, sendPreset: noop, sendAction: noop, sendRematch: noop };
  }

  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === WS_MSG_SERVER.ROOM_CREATED) {
          setRoomId(msg.payload?.roomId as string);
          setPlayerId(msg.payload?.playerId as string);
        } else if (msg.type === WS_MSG_SERVER.ROOM_JOINED) {
          setRoomId(msg.payload?.roomId as string);
          setPlayerId(msg.payload?.playerId as string);
        }
        onMessage(msg.type, msg.payload as Record<string, unknown> | undefined);
      } catch {
        // ignore malformed messages
      }
    };

    wsRef.current = ws;
  }, [onMessage]);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setConnected(false);
    setPlayerId(null);
    setRoomId(null);
  }, []);

  const send = useCallback(
    (type: string, payload?: Record<string, unknown>) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type, payload }));
      }
    },
    [],
  );

  const createRoom = useCallback(() => {
    send(WS_MSG_CLIENT.CREATE_ROOM);
  }, [send]);

  const joinRoom = useCallback(
    (id: string) => {
      send(WS_MSG_CLIENT.JOIN_ROOM, { roomId: id });
    },
    [send],
  );

  const sendPreset = useCallback(
    (preset: string) => {
      send(WS_MSG_CLIENT.SELECT_PRESET, { preset });
    },
    [send],
  );

  const sendAction = useCallback(
    (action: string) => {
      send(WS_MSG_CLIENT.SELECT_ACTION, { action });
    },
    [send],
  );

  const sendRematch = useCallback(() => {
    send(WS_MSG_CLIENT.REMATCH);
  }, [send]);

  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  return {
    connected,
    playerId,
    roomId,
    connect,
    disconnect,
    createRoom,
    joinRoom,
    sendPreset,
    sendAction,
    sendRematch,
  };
}
