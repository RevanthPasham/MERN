import { useState, useEffect } from "react";

const MESSAGES = [
  "COD AVAILABLE TILL \u20B93,000",
  "FREE SHIPPING ON ALL ORDERS",
  "PREMIUM 100% COTTON TEE",
];

export default function TopBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const prev = () => setIndex((i) => (i - 1 + MESSAGES.length) % MESSAGES.length);
  const next = () => setIndex((i) => (i + 1) % MESSAGES.length);

  return (
    <div className="bg-black text-white/70 py-2 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous message"
          className="hidden md:flex items-center justify-center w-6 h-6 rounded-full hover:bg-white/10 transition-colors shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <p className="flex-1 text-center text-xs font-medium tracking-widest uppercase text-white">
          {MESSAGES[index]}
        </p>
        <button
          type="button"
          onClick={next}
          aria-label="Next message"
          className="hidden md:flex items-center justify-center w-6 h-6 rounded-full hover:bg-white/10 transition-colors shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
