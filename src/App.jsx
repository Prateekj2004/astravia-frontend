import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import FeatureForm from "./pages/FeatureForm";
import Payment from "./pages/Payment";
import Report from "./pages/Report";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--bg)]">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/feature/:slug" element={<FeatureForm />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/report" element={<Report />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
  <Route path="/privacy" element={<Privacy />} />
  <Route path="/contact" element={<ContactUs />} />
  <Route path="/refund-policy" element={<CancellationRefund />} />
  <Route path="/terms" element={<Terms />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
