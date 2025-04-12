import { useState } from "react";
import dynamic from "next/dynamic";
const RadarDissonanceChart = dynamic(() => import("../components/RadarDissonanceChart"), { ssr: false });

export default function Home() {
  const [input, setInput] = useState("");
  const [agentVerdicts, setAgentVerdicts] = useState(null);
  const [narrative, setNarrative] = useState("");
  const [rewritten, setRewritten] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const [agentsRes, reframeRes] = await Promise.all([
      fetch("/api/evaluate-agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      }).then(r => r.json()),
      fetch("/api/reframe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      }).then(r => r.json())
    ]);
    setAgentVerdicts(agentsRes);
    setNarrative(reframeRes.narrative);
    setRewritten(reframeRes.rewritten);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold text-blue-700">ENRS + EBRM: Bias Detection & Mitigation</h1>
      <textarea
        rows={6}
        className="w-full border border-gray-300 rounded-md p-4"
        placeholder="Paste AI Decision Text here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        onClick={handleAnalyze}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze & Reframe"}
      </button>

      {agentVerdicts && (
        <>
          <RadarDissonanceChart agentVerdicts={agentVerdicts} />
          <div className="mt-6 space-y-4">
            <div>
              <h2 className="font-semibold text-lg text-green-700">📖 Ethical Narrative</h2>
              <p className="bg-green-50 p-4 rounded text-green-900 whitespace-pre-wrap">{narrative}</p>
            </div>
            <div>
              <h2 className="font-semibold text-lg text-blue-800">✅ Rewritten Fair Decision</h2>
              <p className="bg-blue-50 p-4 rounded text-blue-900 whitespace-pre-wrap">{rewritten}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}