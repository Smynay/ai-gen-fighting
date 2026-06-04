import { Button } from "../ui/Button";

interface ResultScreenProps {
  winner: string | null;
  playerName: string;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export function ResultScreen({
  winner,
  playerName,
  onPlayAgain,
  onBackToMenu,
}: ResultScreenProps) {
  const isWin = winner === "win";
  const isDraw = winner === null;

  return (
    <div className="text-center space-y-6 py-8">
      <div className="text-7xl mb-4">
        {isWin ? "\uD83C\uDFC6" : isDraw ? "\uD83E\uDD1D" : "\uD83D\uDC80"}
      </div>

      <h1
        className={`text-4xl font-bold ${
          isWin
            ? "text-green-400"
            : isDraw
              ? "text-yellow-400"
              : "text-red-400"
        }`}
      >
        {isWin
          ? "YOU WIN!"
          : isDraw
            ? "DRAW"
            : "GAME OVER"}
      </h1>

      <p className="text-gray-400">
        {isWin
          ? "Congratulations! You crushed your opponent!"
          : isDraw
            ? "It's a tie! Both fighters are equally matched."
            : "Better luck next time!"}
      </p>

      <div className="flex gap-4 justify-center">
        <Button variant="primary" size="lg" onClick={onPlayAgain}>
          Play Again
        </Button>
        <Button variant="ghost" size="lg" onClick={onBackToMenu}>
          Main Menu
        </Button>
      </div>
    </div>
  );
}
