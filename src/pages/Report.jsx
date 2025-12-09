import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, LEGAL_DISCLAIMER } from "../api";

export default function Report() {
  const [report, setReport] = useState(null);
  const [identifier, setIdentifier] = useState("");
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("astravia_last_identifier");
    const raw = localStorage.getItem("astravia_last_report");

    if (!id || !raw) {
      navigate("/");
      return;
    }

    setIdentifier(id);
    setReport(JSON.parse(raw));

    fetch(`${API_BASE}/api/user/reports/${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.reports || []);
      })
      .catch((err) => console.error("Error loading history", err));
  }, [navigate]);

  if (!report) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-sm text-gray-600">
        Loading report...
      </div>
    );
  }

  const { meta, coreNumbers, meanings, summary } = report;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="text-xs text-gray-500 hover:text-gray-800 mb-4"
      >
        ← Back to dashboard
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Your Astravia report
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Generated for <span className="font-medium">{meta.name}</span> (
          {meta.dob}) · sent to{" "}
          <span className="font-medium">{identifier}</span>
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Generated at:{" "}
          {new Date(meta.generatedAt).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">
            Core numbers
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div>
              <div className="font-medium">
                Life Path: {coreNumbers.lifePath.value}
              </div>
              {meanings.lifePath && (
                <div className="text-xs text-gray-500">
                  {meanings.lifePath.title} — {meanings.lifePath.summary}
                </div>
              )}
            </div>
            <div>
              <div className="font-medium">
                Destiny: {coreNumbers.destiny.value}
              </div>
              <div className="text-xs text-gray-500">
                {meanings.destiny || "Your destiny number describes your overall direction."}
              </div>
            </div>
            <div>
              <div className="font-medium">
                Soul Urge: {coreNumbers.soulUrge.value}
              </div>
              <div className="text-xs text-gray-500">
                {meanings.soulUrge || "This reveals your inner desires and emotional needs."}
              </div>
            </div>
            <div>
              <div className="font-medium">
                Personality: {coreNumbers.personality.value}
              </div>
              <div className="text-xs text-gray-500">
                {meanings.personality || "How others tend to see you initially."}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">
            Timing & cycles
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div>
              <div className="font-medium">
                Personal year: {coreNumbers.personalYear.value}
              </div>
              <div className="text-xs text-gray-500">
                {meanings.personalYear ||
                  "Your personal year highlights the main theme of this year."}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <span className="font-medium">Pinnacles:</span>{" "}
              {coreNumbers.pinnacles.join(", ")}
            </div>
            <div className="text-xs text-gray-500">
              <span className="font-medium">Challenges:</span>{" "}
              {coreNumbers.challenges.join(", ")}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">
          Big picture summary
        </h2>
        <p className="text-sm text-gray-800 mb-1">{summary.headline}</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          {summary.comboSummary}
        </p>
      </div>

      {history.length > 1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">
            Your previous Astravia reports
          </h2>
          <ul className="space-y-1 text-xs text-gray-600">
            {history
              .slice()
              .reverse()
              .map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between border-b last:border-0 py-1"
                >
                  <span>
                    {item.report?.meta?.name} · {item.report?.meta?.dob}
                  </span>
                  <span className="text-gray-400">
                    {new Date(item.createdAt).toLocaleString(undefined, {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 text-[11px] text-amber-800 rounded-2xl p-4">
        <p className="font-semibold mb-1">Important disclaimer</p>
        <p className="leading-relaxed">{LEGAL_DISCLAIMER}</p>
      </div>
    </div>
  );
}
