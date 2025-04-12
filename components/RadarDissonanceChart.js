import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const getScore = (verdict) => {
  switch ((verdict || "").toLowerCase()) {
    case "fair": return 90;
    case "sensitive": return 65;
    case "unfair": return 30;
    default: return 50;
  }
};

export default function RadarDissonanceChart({ agentVerdicts }) {
  const data = Object.keys(agentVerdicts).map((agent) => ({
    agent: agent.charAt(0).toUpperCase() + agent.slice(1),
    score: getScore(agentVerdicts[agent])
  }));

  return (
    <div className="mt-8">
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="agent" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name="Ethical Agreement" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-sm">
        <h4 className="font-semibold mb-2">Legend</h4>
        <ul className="list-disc pl-6 space-y-1">
          <li><span className="text-green-600 font-medium">80–100:</span> Strong agreement — Fair</li>
          <li><span className="text-yellow-500 font-medium">50–79:</span> Ambiguous — Sensitive</li>
          <li><span className="text-red-500 font-medium">0–49:</span> Strong disagreement — Unfair</li>
        </ul>
      </div>
    </div>
  );
}