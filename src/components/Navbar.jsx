import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="border-b bg-white/90 backdrop-blur shadow-sm sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-lg tracking-tight">
              Astravia
            </span>
            <span className="text-xs text-gray-500">
              Numerology Intelligence
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <Link to="/report" className="text-gray-600 hover:text-gray-900">
            My Reports
          </Link>
        </div>
      </div>
    </nav>
  );
}
