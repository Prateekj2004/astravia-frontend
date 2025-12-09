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
    const parsed = JSON.parse(raw);
    setReport(parsed);

    fetch(`${API_BASE}/api/user/reports/${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((data) => setHistory(data.reports || []))
      .catch((err) => console.error("Error loading history", err));
  }, [navigate]);

  if (!report) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-sm text-gray-600">
        Loading report...
      </div>
    );
  }

  // ----------- DETECT REPORT TYPE -----------
  const isCompatibility = report.score !== undefined;
  const isBusiness = report.luckyNumbers !== undefined;
  const isFull = report.coreNumbers?.pinnacles !== undefined;
  const isName = !isCompatibility && !isBusiness && !isFull;

  // ------------------------------------------

  const meta = report.meta || {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="text-xs text-gray-500 hover:text-gray-800 mb-4"
      >
        ← Back to dashboard
      </button>

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Your Astravia Report
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Generated for <b>{meta.name}</b> ({meta.dob}) · sent to{" "}
          <b>{identifier}</b>
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Generated at:{" "}
          {new Date(meta.generatedAt).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>

      {/* ============================
          1) COMPATIBILITY REPORT UI
          ============================ */}
      {isCompatibility && (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Compatibility Score
            </h2>

            <div className="text-4xl font-bold text-purple-600 mb-1">
              {report.score}%
            </div>
            <p className="text-sm text-gray-700 mb-4">{report.headline}</p>

            <p className="text-sm text-gray-600 leading-relaxed">
              {report.summary}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <PersonBox title="Person A" profile={report.profiles.personA} />
            <PersonBox title="Person B" profile={report.profiles.personB} />
          </div>
        </>
      )}

      {/* ============================
          2) BUSINESS / LUCKY REPORT UI
          ============================ */}
      {isBusiness && (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Business Lucky Profile
            </h2>

            <div className="text-sm text-gray-700 space-y-2">
              <div>
                <b>Primary Number:</b> {report.luckyNumbers.primary}
              </div>
              <div>
                <b>Secondary Number:</b> {report.luckyNumbers.secondary}
              </div>
              <div>
                <b>Support Numbers:</b>{" "}
                {report.luckyNumbers.support.join(", ")}
              </div>
              <div>
                <b>Lucky Colors:</b> {report.luckyColors.join(", ")}
              </div>
              <div>
                <b>Lucky Days:</b> {report.luckyDays.join(", ")}
              </div>
              <div>
                <b>Lucky Initials:</b> {report.luckyInitials.join(", ")}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
              Name Tuning Suggestions
            </h2>

            {report.nameTuning.suggestions.length === 0 ? (
              <p className="text-sm text-gray-600">
                No tuning needed — your name already aligns with your vibration.
              </p>
            ) : (
              <ul className="text-sm text-gray-700 space-y-1">
                {report.nameTuning.suggestions.map((s, i) => (
                  <li key={i} className="border-b pb-1 last:border-none">
                    <b>{s.variant}</b> (add “{s.addedLetter}”)
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {/* ============================
          3) FULL OR NAME NUMEROLOGY REPORT UI
          ============================ */}
      {(isName || isFull) && (
        <>
          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <CoreBox core={report.coreNumbers} meanings={report.meanings} />
            <TimingBox core={report.coreNumbers} meanings={report.meanings} />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
              Big picture summary
            </h2>
            <p className="text-sm text-gray-800 mb-1">
              {report.summary?.headline}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {report.summary?.comboSummary}
            </p>
          </div>
        </>
      )}

      {/* HISTORY */}
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

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 text-[11px] text-amber-800 rounded-2xl p-4">
        <p className="font-semibold mb-1">Important disclaimer</p>
        <p className="leading-relaxed">{LEGAL_DISCLAIMER}</p>
      </div>
    </div>
  );
}

// ============================================
// REUSABLE BOX COMPONENTS
// ============================================

function PersonBox({ title, profile }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-sm font-semibold text-gray-800 mb-3">{title}</h2>
      <div className="text-sm text-gray-700 space-y-1">
        <div>
          <b>Life Path:</b> {profile.lifePath.value}
        </div>
        <div>
          <b>Destiny:</b> {profile.destiny.value}
        </div>
        <div>
          <b>Soul Urge:</b> {profile.soulUrge.value}
        </div>
        <div>
          <b>Personality:</b> {profile.personality.value}
        </div>
      </div>
    </div>
  );
}

function CoreBox({ core, meanings }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-sm font-semibold text-gray-800 mb-3">
        Core numbers
      </h2>

      <div className="space-y-2 text-sm text-gray-700">
        <div>
          <b>Life Path:</b> {core.lifePath.value}
          <div className="text-xs text-gray-500">
            {meanings.lifePath?.title} — {meanings.lifePath?.summary}
          </div>
        </div>
        <div>
          <b>Destiny:</b> {core.destiny.value}
        </div>
        <div>
          <b>Soul Urge:</b> {core.soulUrge.value}
        </div>
        <div>
          <b>Personality:</b> {core.personality.value}
        </div>
      </div>
    </div>
  );
}

function TimingBox({ core, meanings }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-sm font-semibold text-gray-800 mb-3">
        Timing & cycles
      </h2>

      <div className="text-sm text-gray-700 space-y-2">
        <div>
          <b>Personal Year:</b> {core.personalYear.value}
        </div>
        <div className="text-xs text-gray-500">
          {meanings.personalYear}
        </div>
        <div className="text-xs text-gray-500">
          <b>Pinnacles:</b> {core.pinnacles.join(", ")}
        </div>
        <div className="text-xs text-gray-500">
          <b>Challenges:</b> {core.challenges.join(", ")}
        </div>
      </div>
    </div>
  );
}
