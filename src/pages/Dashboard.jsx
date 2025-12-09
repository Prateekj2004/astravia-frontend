import FeatureCard from "../components/FeatureCard";
import { REPORT_PRICE } from "../api";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Name Numerology Report",
    slug: "name",
    badge: "Popular",
    description:
      "Decode your name’s core energies, strengths, and life direction.",
  },
  {
    title: "Business / Brand Name Tuning",
    slug: "business",
    badge: "For founders",
    description:
      "Get lucky name suggestions, colours and vibration for your brand or startup.",
  },
  {
    title: "Compatibility Report",
    slug: "compatibility",
    badge: "Relationships",
    description:
      "Understand how two people’s numbers interact in love, friendship or business.",
  },
  {
    title: "Full Advanced Numerology Report",
    slug: "full",
    badge: "Deep dive",
    description:
      "Pinnacles, challenges, karmic debts and timing — a comprehensive numerology map.",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  // ⭐ UNIVERSAL START HANDLER
  const startFeature = (slug) => {
    // STEP 1 → Ask inputs depending on the feature
    let name, dob, identifier, personA, personB;

    switch (slug) {
      case "name":
        name = prompt("Enter your name:");
        dob = prompt("Enter your date of birth (YYYY-MM-DD):");
        identifier = prompt("Enter your email or phone:");
        sessionStorage.setItem(
          "astravia_active_request",
          JSON.stringify({
            feature: "name",
            name,
            dob,
            identifier,
          })
        );
        break;

      case "business":
        name = prompt("Enter your business or brand name:");
        dob = prompt("Your DOB (optional — press OK to skip):") || "2000-01-01";
        identifier = prompt("Enter your email:");
        sessionStorage.setItem(
          "astravia_active_request",
          JSON.stringify({
            feature: "business",
            name,
            dob,
            identifier,
          })
        );
        break;

      case "compatibility":
        personA = {
          name: prompt("Your name:"),
          dob: prompt("Your DOB (YYYY-MM-DD):"),
        };
        personB = {
          name: prompt("Partner's name:"),
          dob: prompt("Partner's DOB (YYYY-MM-DD):"),
        };
        identifier = prompt("Enter your email:");
        sessionStorage.setItem(
          "astravia_active_request",
          JSON.stringify({
            feature: "compatibility",
            personA,
            personB,
            identifier,
          })
        );
        break;

      case "full":
        name = prompt("Enter your name:");
        dob = prompt("Enter your DOB (YYYY-MM-DD):");
        identifier = prompt("Enter your email:");
        sessionStorage.setItem(
          "astravia_active_request",
          JSON.stringify({
            feature: "full",
            name,
            dob,
            identifier,
          })
        );
        break;

      default:
        alert("Invalid feature");
        return;
    }

    // STEP 2 → Move to payment page
    navigate("/payment");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <section className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 border border-purple-100">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          Intro offer: Each detailed report at just ₹{REPORT_PRICE}
        </div>

        <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
          Clarity through{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">
            numbers
          </span>
          .
        </h1>
        <p className="mt-2 text-gray-600 max-w-2xl text-sm sm:text-base">
          Astravia turns your name and date of birth into simple, actionable
          numerology insights — customised for your life, relationships, and
          business.
        </p>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          Choose a report to get started
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {features.map((f) => (
            <FeatureCard key={f.slug} {...f} start={() => startFeature(f.slug)} />
          ))}
        </div>
      </section>
    </div>
  );
}
