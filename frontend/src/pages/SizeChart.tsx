import { Link, useLocation } from "react-router-dom";

export default function SizeChart() {
  const loc = useLocation();
  const title = loc.pathname.split("/").pop()?.replace(/-/g, " ") ?? "Size chart";

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4 capitalize">{title}</h1>
      <p className="text-gray-600 mb-4">Size chart content can be added here.</p>
      <Link to="/" className="text-blue-600 underline">← Back to home</Link>
    </main>
  );
}
