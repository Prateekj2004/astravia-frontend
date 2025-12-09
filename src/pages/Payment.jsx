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

// ⭐ PICK API ROUTE BASED ON FEATURE
function getFeatureRoute(feature) {
  switch (feature) {
    case "name":
      return "/api/report/generate";

    case "business":
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

  // Load stored feature data
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

    // PICK CORRECT BACKEND ROUTE
    const apiRoute = getFeatureRoute(feature);

    // BUILD PAYLOAD FOR FEATURE
    let payload = {};
    if (feature === "compatibility") {
      payload = {
        personA: requestData.personA,
        personB: requestData.personB,
      };
    } else {
      payload = {
        name: requestData.name,
        dob: requestData.dob,
      };
    }

    // ⭐ IF PRICE = 0 → FREE MODE
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

        // SAVE REPORT LOCALLY
        localStorage.setItem("astravia_last_identifier", identifier);
        localStorage.setItem("astravia_last_report", JSON.stringify(data));

        navigate("/report");
        return;
      } catch (err) {
        console.error(err);
        alert("Free report error. Try again.");
      } finally {
        setLoading(false);
      }
    }

    // ⭐ PAID MODE (RAZORPAY)
    setLoading(true);

    try {
      const ok = await loadRazorpayScript();
      if (!ok) {
        alert("Unable to load payment gateway. Check internet.");
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
        console.error(orderData);
        alert("Failed to create order.");
        setLoading(false);
        return;
      }

      const { key, orderId, amount, currency } = orderData;

      const rzp = new window.Razorpay({
        key,
        amount,
        currency,
        name: "Astravia",
        description: `Astravia ${feature} report`,
        order_id: orderId,
        prefill: {
          name: payload?.name || payload?.personA?.name,
          email: identifier,
        },
        theme: { color: "#6d28d9" },

        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_BASE}/api/pay/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                identifier,
                name: payload.name || payload.personA?.name,
                dob: payload.dob || payload.personA?.dob,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
              console.error(verifyData);
              alert("Payment verified but report generation failed.");
              return;
            }

            localStorage.setItem(
              "astravia_last_identifier",
              identifier
            );
            localStorage.setItem(
              "astravia_last_report",
              JSON.stringify(verifyData.report)
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

  if (!requestData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-sm text-gray-600">
        Loading...
      </div>
    );
  }

  const { feature, identifier } = requestData;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-xs text-gray-500 hover:text-gray-800 mb-4"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-semibold text-gray-900 mb-1">
        {REPORT_PRICE === 0 ? "Generate your free report" : "Secure payment"}
      </h1>

      <p className="text-sm text-gray-600 mb-6">
        {REPORT_PRICE === 0 ? (
          <>
            Click below to instantly generate your{" "}
            <span className="font-medium">{feature}</span> report for{" "}
            <b>free</b>. It will be shown next and emailed to{" "}
            <b>{identifier}</b>.
          </>
        ) : (
          <>
            Complete your payment to generate your{" "}
            <span className="font-medium">{feature}</span> report. It will be
            shown after payment and emailed to <b>{identifier}</b>.
          </>
        )}
      </p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Report price</span>
          <span className="font-semibold text-gray-900">
            ₹{REPORT_PRICE}.00
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Taxes & fees</span>
          <span>Included</span>
        </div>

        <div className="border-t pt-3 flex items-center justify-between text-sm">
          <span className="font-medium text-gray-800">Total</span>
          <span className="text-lg font-semibold text-purple-600">
            ₹{REPORT_PRICE}.00
          </span>
        </div>

        <button
          onClick={handlePay}
          disabled={loading}
          className="mt-2 w-full inline-flex items-center justify-center rounded-xl bg-purple-600 text-white text-sm font-medium px-5 py-2.5 hover:bg-purple-700 transition shadow-sm disabled:opacity-60"
        >
          {loading
            ? "Processing..."
            : REPORT_PRICE === 0
            ? "Generate my free report"
            : "Pay & generate my report"}
        </button>

        <p className="mt-3 text-[11px] text-gray-500 leading-relaxed">
          <strong className="font-semibold">Disclaimer:</strong>{" "}
          {LEGAL_DISCLAIMER}
        </p>
      </div>
    </div>
  );
}
