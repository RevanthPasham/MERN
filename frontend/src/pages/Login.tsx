import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, register } from "../api/client";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        const res = await register(email, password, name || undefined);
        if (res.success && res.data) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } else {
        const res = await login(email, password);
        if (res.success && res.data) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      }
      navigate("/profile");
      window.location.reload();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
        {isRegister ? "Create account" : "Login"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Your name"
            />
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={isRegister ? 6 : 1}
            className="w-full border rounded-lg px-3 py-2"
            placeholder={isRegister ? "Min 6 characters" : "Password"}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
          }}
          className="text-blue-600 underline"
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
      <p className="mt-4 text-center">
        <Link to="/" className="text-sm text-gray-500 hover:underline">
          ← Back to home
        </Link>
      </p>
    </main>
  );
}
