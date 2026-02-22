declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string };
  theme?: { color: string };
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string }) => void;
  modal?: { ondismiss?: () => void };
}

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript(): Promise<void> {
  if (typeof window !== "undefined" && window.Razorpay) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout."));
    document.body.appendChild(script);
  });
}

export function openRazorpay(opts: {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
  user?: { name?: string | null; email?: string };
  onSuccess?: () => void;
  onDismiss?: () => void;
}): Promise<void> {
  if (!opts || typeof opts !== "object") {
    return Promise.reject(new Error("Invalid payment options"));
  }
  const amount = Number(opts.amount);
  if (!Number.isFinite(amount) || amount < 100) {
    return Promise.reject(new Error("Invalid amount for payment"));
  }
  const key = opts.key && String(opts.key).trim();
  const orderId = opts.orderId && String(opts.orderId).trim();
  const currency = (opts.currency && String(opts.currency).trim()) || "INR";
  if (!key || !orderId) {
    return Promise.reject(new Error("Missing payment key or order id"));
  }
  return loadRazorpayScript().then(() => {
    const options: RazorpayOptions = {
      key,
      amount,
      currency,
      name: "GEEK TEE",
      description: "Cart Payment",
      order_id: orderId,
      prefill: {
        name: opts.user?.name ?? undefined,
        email: opts.user?.email ?? undefined,
      },
      theme: { color: "#1e3a5f" },
      handler: function () {
        if (opts.onSuccess) opts.onSuccess();
        else alert("Payment Successful 🎉");
      },
      modal: {
        ondismiss: function () {
          if (opts.onDismiss) opts.onDismiss();
        },
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  });
}
