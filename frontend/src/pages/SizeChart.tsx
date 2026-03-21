import { Link, useLocation } from "react-router-dom";

const CROP_TOP_DATA = {
  title: "Size Chart \u2013 Crop Top",
  rows: [
    { size: "XS", chest: '30\u201332"', length: '14"', shoulder: '13.5"' },
    { size: "S",  chest: '32\u201334"', length: '14.5"', shoulder: '14"' },
    { size: "M",  chest: '34\u201336"', length: '15"', shoulder: '14.5"' },
    { size: "L",  chest: '36\u201338"', length: '15.5"', shoulder: '15"' },
    { size: "XL", chest: '38\u201340"', length: '16"', shoulder: '15.5"' },
  ],
};

const CROP_TANK_DATA = {
  title: "Size Chart \u2013 Crop Tank",
  rows: [
    { size: "XS", chest: '30\u201332"', length: '13"', shoulder: '12.5"' },
    { size: "S",  chest: '32\u201334"', length: '13.5"', shoulder: '13"' },
    { size: "M",  chest: '34\u201336"', length: '14"', shoulder: '13.5"' },
    { size: "L",  chest: '36\u201338"', length: '14.5"', shoulder: '14"' },
    { size: "XL", chest: '38\u201340"', length: '15"', shoulder: '14.5"' },
  ],
};

export default function SizeChart() {
  const loc = useLocation();
  const isTank = loc.pathname.includes("crop-tank");
  const data = isTank ? CROP_TANK_DATA : CROP_TOP_DATA;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-[#1e3a5f] hover:underline mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to home
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">{data.title}</h1>

      {/* How to measure */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
        <h2 className="font-semibold text-[#1e3a5f] mb-3 text-sm uppercase tracking-wide">
          How to Measure
        </h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-[#1e3a5f] font-bold shrink-0">1.</span>
            <span>
              <strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal and snug but not tight.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#1e3a5f] font-bold shrink-0">2.</span>
            <span>
              <strong>Length:</strong> Measure from the highest point of the shoulder seam down to the hem of the garment.
            </span>
          </li>
        </ul>
      </div>

      {/* Size chart table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-[#1e3a5f] text-white">
              <th className="px-4 py-3 font-semibold">Size</th>
              <th className="px-4 py-3 font-semibold">Chest</th>
              <th className="px-4 py-3 font-semibold">Length</th>
              <th className="px-4 py-3 font-semibold">Shoulder</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, i) => (
              <tr
                key={row.size}
                className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="px-4 py-3 font-semibold text-[#1e3a5f]">{row.size}</td>
                <td className="px-4 py-3 text-gray-700">{row.chest}</td>
                <td className="px-4 py-3 text-gray-700">{row.length}</td>
                <td className="px-4 py-3 text-gray-700">{row.shoulder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Note */}
      <p className="mt-4 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
        Measurements are in inches. If you&apos;re between sizes, we recommend sizing up.
      </p>
    </main>
  );
}
