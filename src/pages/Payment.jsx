import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, REPORT_PRICE, LEGAL_DISCLAIMER } from "../api";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ⭐ Correct backend routes for each feature
function getFeatureRoute(feature) {
  switch (feature) {
    case "name":
      return "/api/report/generate";

    case "lucky":
      return "/api/lucky/generate";

    case "compatibility":
      return "/api/compatibility/check";

    case "full":
      return "/api/report/generate?mode=full";

    default:
      return "/api/report/generate";
  }
}

export default function Payment() {
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = sessionStorage.getItem("astravia_active_request");
    if (!raw) {
      navigate("/");
      return;
    }
    setRequestData(JSON.parse(raw));
  }, [navigate]);

  const handlePay = async () => {
    if (!requestData) return;

    const { feature, identifier } = requestData;

    // ⭐ PICK BACKEND ROUTE
    const apiRoute = getFeatureRoute(feature);

    // ⭐ Normalize name & dob for backend verify
    let name, dob;

    if (feature === "compatibility") {
      name = requestData.personA?.name;
      dob = requestData.personA?.dob;
    } else {
      name = requestData.name;
      dob = requestData.dob;
    }

    // ⭐ BUILD PAYLOAD FOR FREE MODE
    let payload =
      feature === "compatibility"
        ? { personA: requestData.personA, personB: requestData.personB }
        : { name, dob };

    // --------------------------------------------
    // ⭐ FREE MODE (REPORT_PRICE = 0)
    // --------------------------------------------
    if (REPORT_PRICE === 0) {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE}${apiRoute}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!data) {
          alert("Unexpected server response.");
          return;
        }

        // Save report
        localStorage.setItem("astravia_last_identifier", identifier);
        localStorage.setItem("astravia_last_report", JSON.stringify(data));

        navigate("/report");
        return;
      } catch (err) {
        console.error(err);
        alert("Free report error.");
      } finally {
        setLoading(false);
      }
    }

    // --------------------------------------------
    // ⭐ PAID MODE — RAZORPAY
    // --------------------------------------------
    setLoading(true);

    try {
      const ok = await loadRazorpayScript();
      if (!ok) {
        alert("Payment library failed to load.");
        setLoading(false);
        return;
      }

      const orderRes = await fetch(`${API_BASE}/api/pay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: REPORT_PRICE }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        alert("Order creation failed.");
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Astravia",
        description: `Astravia ${feature} report`,
        order_id: orderData.orderId,
        prefill: { name, email: identifier },
        theme: { color: "#6d28d9" },

        // 🎯 Payment successful → verify → save → redirect
        handler: async function (response) {
          try {
            const vRes = await fetch(`${API_BASE}/api/pay/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                identifier,
                name,
                dob,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const vData = await vRes.json();

            if (!vData.success) {
              alert("Payment verified but report failed.");
              return;
            }

            // Save report
            localStorage.setItem("astravia_last_identifier", identifier);
            localStorage.setItem(
              "astravia_last_report",
              JSON.stringify(vData.report)
            );

            navigate("/report");
          } catch (err) {
            console.error(err);
            alert("Verification error.");
          }
        },
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment error.");
    } finally {
      setLoading(false);
    }
  };

  if (!requestData)
    return <div className="p-10 text-center">Loading…</div>;

  const { feature, identifier } = requestData;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-xs text-gray-500">
        ← Back
      </button>

      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        {REPORT_PRICE === 0 ? "Generate your free report" : "Secure payment"}
      </h1>

      <p className="text-sm text-gray-600 mb-6">
        Your <b>{feature}</b> report will be sent to <b>{identifier}</b>.
      </p>

      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between text-sm mb-3">
  <span className="text-gray-600">Report price</span>
  <span className="font-semibold text-gray-900">₹{REPORT_PRICE}.00</span>
</div>

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2.5 rounded-xl"
        >
          {loading
            ? "Processing..."
            : REPORT_PRICE === 0
            ? "Generate my free report"
            : "Pay & generate report"}
        </button>
      </div>
    </div>
  );
}
