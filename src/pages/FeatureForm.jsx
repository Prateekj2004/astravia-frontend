import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LEGAL_DISCLAIMER } from "../api";

function getTitleAndDescription(slug) {
  switch (slug) {
    case "name":
      return {
        title: "Name Numerology Report",
        subtitle:
          "Understand your core path, destiny and inner motivations through your name and date of birth.",
      };
    case "lucky":
      return {
        title: "Business / Lucky Name Tuning",
        subtitle:
          "Align your name or brand with supportive numbers, colours and vibrations.",
      };
    case "compatibility":
      return {
        title: "Compatibility Report",
        subtitle:
          "Explore how two people’s energies interact in relationships, friendship or business.",
      };
    case "full":
    default:
      return {
        title: "Full Advanced Numerology Report",
        subtitle:
          "A complete numerology map — pinnacles, challenges, karmic patterns and timing.",
      };
  }
}

export default function FeatureForm() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { title, subtitle } = getTitleAndDescription(slug);

  // common: identifier (email) used as user key
  const [identifier, setIdentifier] = useState("");
  const [primaryName, setPrimaryName] = useState("");
  const [primaryDob, setPrimaryDob] = useState("");

  // for compatibility
  const [personBName, setPersonBName] = useState("");
  const [personBDob, setPersonBDob] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // store context in sessionStorage for payment step
    const payload =
      slug === "compatibility"
        ? {
            feature: slug,
            identifier,
            personA: { name: primaryName, dob: primaryDob },
            personB: { name: personBName, dob: personBDob },
          }
        : {
            feature: slug,
            identifier,
            name: primaryName,
            dob: primaryDob,
          };

    sessionStorage.setItem("astravia_active_request", JSON.stringify(payload));
    navigate("/payment");
  };

  const showCompatibility = slug === "compatibility";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-xs text-gray-500 hover:text-gray-800 mb-4"
      >
        ← Back
      </button>

      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1">
        {title}
      </h1>
      <p className="text-sm text-gray-600 mb-6">{subtitle}</p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!showCompatibility && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={primaryName}
                  onChange={(e) => setPrimaryName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of birth
                </label>
                <input
                  type="date"
                  required
                  value={primaryDob}
                  onChange={(e) => setPrimaryDob(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                />
              </div>
            </>
          )}

          {showCompatibility && (
            <>
              <p className="text-xs text-gray-500 mb-1">
                Person A details (You or first person)
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Person A name
                  </label>
                  <input
                    type="text"
                    required
                    value={primaryName}
                    onChange={(e) => setPrimaryName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Person A date of birth
                  </label>
                  <input
                    type="date"
                    required
                    value={primaryDob}
                    onChange={(e) => setPrimaryDob(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4 mb-1">
                Person B details (Partner, friend or business associate)
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Person B name
                  </label>
                  <input
                    type="text"
                    required
                    value={personBName}
                    onChange={(e) => setPersonBName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Person B date of birth
                  </label>
                  <input
                    type="date"
                    required
                    value={personBDob}
                    onChange={(e) => setPersonBDob(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email 
            </label>
            <input
              type="email"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
            />
            <p className="mt-1 text-[11px] text-gray-500">
              We&apos;ll only use this to send your report and show your past
              reports inside Astravia.
            </p>
          </div>

          <button
            type="submit"
            className="mt-3 w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-purple-600 text-white text-sm font-medium px-5 py-2.5 hover:bg-purple-700 transition shadow-sm"
          >
            Continue to payment
          </button>
        </form>

        <div className="mt-5 border-t pt-4">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            <strong className="font-semibold">Disclaimer:</strong>{" "}
            {LEGAL_DISCLAIMER}
          </p>
        </div>
      </div>
    </div>
  );
}
