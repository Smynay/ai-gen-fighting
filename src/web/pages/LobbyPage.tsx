import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

interface LobbyPageProps {
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
  connected: boolean;
  roomId: string | null;
  hasOpponent: boolean;
}

export function LobbyPage({
  onCreateRoom,
  onJoinRoom,
  connected,
  roomId,
  hasOpponent,
}: LobbyPageProps) {
  const navigate = useNavigate();
  const [joinId, setJoinId] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">PvP Mode</h1>
          <p className="text-gray-400 text-sm">
            {connected ? "Connected to server" : "Connecting..."}
          </p>
        </div>

        {!connected && (
          <div className="text-center text-yellow-400 animate-pulse">
            Connecting to game server...
          </div>
        )}

        {roomId && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center space-y-3">
            <p className="text-gray-400 text-sm">Your Room ID:</p>
            <p className="text-3xl font-bold text-indigo-400 font-mono tracking-widest">
              {roomId}
            </p>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm text-gray-300 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <p className="text-gray-500 text-xs">
              Share this ID with your opponent
            </p>
            {!hasOpponent && (
              <div className="animate-pulse text-yellow-400 text-sm">
                Waiting for opponent...
              </div>
            )}
            {copied && (
              <div className="text-green-400 text-xs animate-fadeIn">
                Room ID copied to clipboard!
              </div>
            )}
          </div>
        )}

        {!roomId && connected && (
          <>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={onCreateRoom}
            >
              Create Room
            </Button>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-gray-700" />
              <span className="text-gray-500 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-700" />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Room ID"
                value={joinId}
                onChange={(e) => setJoinId(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white text-center font-mono tracking-widest uppercase outline-none focus:border-indigo-500"
                maxLength={6}
              />
              <Button
                variant="secondary"
                disabled={joinId.length < 4}
                onClick={() => onJoinRoom(joinId)}
              >
                Join
              </Button>
            </div>
          </>
        )}

        <div className="text-center">
          <Button variant="ghost" onClick={() => navigate("/")}>
            Back to Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
