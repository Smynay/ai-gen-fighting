import { useState } from "react";
import { Button } from "../ui/Button";

interface Preset {
  value: string;
  details: { health: number; stamina: number };
}

interface CharacterSelectProps {
  presets: Preset[];
  onSelect: (preset: string) => void;
}

const classDescriptions: Record<string, { icon: string; desc: string }> = {
  light: {
    icon: "\uD83D\uDCE1",
    desc: "Fast & fragile. High stamina, low health.",
  },
  medium: {
    icon: "\u2694\uFE0F",
    desc: "Balanced fighter. Equal health and stamina.",
  },
  heavy: {
    icon: "\uD83D\uDEE1\uFE0F",
    desc: "Slow & tanky. High health, low stamina.",
  },
};

export function CharacterSelect({ presets, onSelect }: CharacterSelectProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Class</h2>
        <p className="text-gray-400 text-sm">
          Select your fighter archetype
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {presets.map((preset) => {
          const info = classDescriptions[preset.value] ?? {
            icon: "\u2753",
            desc: "",
          };
          const isSelected = selected === preset.value;

          return (
            <button
              key={preset.value}
              onClick={() => setSelected(preset.value)}
              className={`
                p-6 rounded-xl border-2 text-left transition-all duration-200
                ${
                  isSelected
                    ? "border-indigo-400 bg-indigo-900/30 shadow-lg shadow-indigo-500/20"
                    : "border-gray-600 bg-gray-800 hover:border-gray-500"
                }
              `}
            >
              <div className="text-4xl mb-3">{info.icon}</div>
              <div className="font-bold text-lg text-white uppercase mb-1">
                {preset.value}
              </div>
              <div className="text-sm text-gray-400 mb-3">{info.desc}</div>
              <div className="flex gap-4 text-sm">
                <span className="text-red-400">
                  HP: {preset.details.health}
                </span>
                <span className="text-blue-400">
                  SP: {preset.details.stamina}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-center">
        <Button
          variant="primary"
          size="lg"
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
        >
          {selected ? `Fight as ${selected.toUpperCase()}!` : "Select a class"}
        </Button>
      </div>
    </div>
  );
}
