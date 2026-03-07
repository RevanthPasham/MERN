import { Routes, Route, Link } from "react-router-dom";
import InterviewDashboard from "./pages/InterviewDashboard";
import RecordingDetail from "./pages/RecordingDetail";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/50 px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="text-lg font-semibold text-white">
            Interview Platform
          </Link>
          <nav className="flex gap-4">
            <Link to="/" className="text-slate-300 hover:text-white">
              Home
            </Link>
            <Link to="/history" className="text-slate-300 hover:text-white">
              History
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes>
          <Route path="/" element={<InterviewDashboard />} />
          <Route path="/history" element={<InterviewDashboard />} />
          <Route path="/recording/:id" element={<RecordingDetail />} />
        </Routes>
      </main>
    </div>
  );
}
