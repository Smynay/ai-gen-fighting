interface CombatEffectProps {
  text: string;
  type: "damage" | "heal" | "block";
  side: "left" | "right";
}

const typeConfig = {
  damage: { color: "text-red-400", prefix: "-" },
  heal: { color: "text-green-400", prefix: "+" },
  block: { color: "text-blue-400", prefix: "-" },
};

export function CombatEffect({ text, type, side }: CombatEffectProps) {
  const config = typeConfig[type];
  const sideClass = side === "left" ? "left-4" : "right-4";

  return (
    <div
      className={`absolute top-8 ${sideClass} animate-float-up pointer-events-none`}
    >
      <span
        className={`text-3xl font-black ${config.color} drop-shadow-lg`}
      >
        {config.prefix}
        {text}
      </span>
    </div>
  );
}
