import { Link } from "react-router-dom";

export default function FeatureCard({ title, slug, badge, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition">
      
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="font-semibold text-lg text-gray-900">{title}</h2>

          {badge && (
            <span className="text-[10px] px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100 uppercase tracking-wide">
              {badge}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4">{description}</p>
      </div>

      <Link
        to={`/feature/${slug}`}
        className="text-xs font-medium text-purple-600 hover:text-purple-700 mt-2"
      >
        Start now →
      </Link>
    </div>
  );
}
