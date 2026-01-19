import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

interface PersonalityTypeSelectionProps {
  suggestedType: string;
  onConfirm: (selectedType: string) => void;
}

const PERSONALITY_TYPES = [
  {
    value: "Strategic Visionary",
    label: "Strategic Visionary",
    description: "Big-picture thinker who focuses on long-term goals and innovation",
  },
  {
    value: "Analytical Executor",
    label: "Analytical Executor",
    description: "Data-driven decision maker who values precision and measurable results",
  },
  {
    value: "Creative Innovator",
    label: "Creative Innovator",
    description: "Out-of-the-box thinker who thrives on experimentation and new ideas",
  },
  {
    value: "Balanced Leader",
    label: "Balanced Leader",
    description: "Adaptable leader who balances strategy, execution, and team dynamics",
  },
  {
    value: "Pragmatic Operator",
    label: "Pragmatic Operator",
    description: "Hands-on problem solver who focuses on practical solutions and efficiency",
  },
];

export function PersonalityTypeSelection({
  suggestedType,
  onConfirm,
}: PersonalityTypeSelectionProps) {
  const [selectedType, setSelectedType] = useState(suggestedType);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full bg-gradient-to-br from-gray-900 to-black border-cyan-500/30 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Choose Your Personality Type
          </h2>
          <p className="text-gray-400">
            I've suggested <span className="text-cyan-400 font-semibold">{suggestedType}</span> based on our conversation. 
            You can keep it or choose a different type that resonates with you.
          </p>
        </div>

        <RadioGroup value={selectedType} onValueChange={setSelectedType} className="space-y-4 mb-8">
          {PERSONALITY_TYPES.map((type) => (
            <div
              key={type.value}
              className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                selectedType === type.value
                  ? "border-cyan-500 bg-cyan-500/10"
                  : "border-gray-700 hover:border-gray-600 bg-black/30"
              }`}
              onClick={() => setSelectedType(type.value)}
            >
              <div className="flex items-start gap-4">
                <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={type.value} className="text-lg font-semibold cursor-pointer flex items-center gap-2">
                    {type.label}
                    {type.value === suggestedType && (
                      <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">
                        Suggested
                      </span>
                    )}
                  </Label>
                  <p className="text-sm text-gray-400 mt-1">{type.description}</p>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>

        <Button
          size="lg"
          onClick={() => onConfirm(selectedType)}
          className="w-full py-6 text-lg"
          style={{
            background: "linear-gradient(135deg, #00d9ff 0%, #0099cc 100%)",
            color: "#000",
          }}
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Confirm Personality Type
        </Button>
      </Card>
    </div>
  );
}
