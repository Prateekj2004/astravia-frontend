import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-10 border-t py-6 text-center text-gray-600 text-sm">
      <div className="flex flex-col sm:flex-row justify-center gap-4">

        <Link to="/shipping-policy" className="hover:text-purple-600">
          Shipping Policy
        </Link>

        <Link to="/privacy" className="hover:text-purple-600">
          Privacy
        </Link>

        <Link to="/contact" className="hover:text-purple-600">
          Contact Us
        </Link>

        <Link to="/refund-policy" className="hover:text-purple-600">
          Cancellation & Refunds
        </Link>

        <Link to="/terms" className="hover:text-purple-600">
          Terms & Conditions
        </Link>

      </div>

      <p className="mt-4 text-xs text-gray-400">
        © {new Date().getFullYear()} Astravia. All rights reserved.
      </p>
    </footer>
  );
}
