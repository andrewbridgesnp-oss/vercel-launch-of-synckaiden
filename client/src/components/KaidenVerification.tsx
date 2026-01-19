import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Edit } from "lucide-react";

interface KaidenVerificationProps {
  responses: string[];
  personalityType: string;
  insights: string[];
  onConfirm: () => void;
  onEdit: () => void;
}

export function KaidenVerification({
  responses,
  personalityType,
  insights,
  onConfirm,
  onEdit,
}: KaidenVerificationProps) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full bg-gradient-to-br from-gray-900 to-black border-cyan-500/30 p-8">
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Kaiden Has Synced With You
          </h2>
          <p className="text-gray-400">
            Review what I've learned about you and your business
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <div className="bg-black/50 border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-purple-400">Your Personality Type</h3>
            <p className="text-2xl font-bold text-white mb-2">{personalityType}</p>
            <p className="text-gray-400 text-sm">
              This helps me understand how you prefer to work and make decisions
            </p>
          </div>

          <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-cyan-400">Key Insights</h3>
            <ul className="space-y-3">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                  <p className="text-gray-300">{insight}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-green-400">Your Responses</h3>
            <div className="space-y-3">
              {responses.map((response, index) => (
                <div key={index} className="border-l-2 border-green-500/50 pl-4">
                  <p className="text-sm text-gray-500 mb-1">Question {index + 1}</p>
                  <p className="text-gray-300">{response}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            onClick={onConfirm}
            className="flex-1 py-6 text-lg"
            style={{
              background: "linear-gradient(135deg, #00d9ff 0%, #0099cc 100%)",
              color: "#000",
            }}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            This Looks Good
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={onEdit}
            className="flex-1 py-6 text-lg border-cyan-500/50 hover:bg-cyan-500/10"
          >
            <Edit className="w-5 h-5 mr-2" />
            Let Me Adjust
          </Button>
        </div>
      </Card>
    </div>
  );
}
