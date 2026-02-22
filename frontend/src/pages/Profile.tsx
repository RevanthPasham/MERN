import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

      {!user ? (
        <div className="space-y-6">
          <p className="text-gray-600">Log in to see your order history and account details.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/login"
              className="inline-flex justify-center items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800"
            >
              Login
            </Link>
            <Link
              to="/login"
              className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 font-medium rounded-lg hover:bg-gray-50"
            >
              Register
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Logged in as</p>
              <p className="font-medium text-gray-900">{user.email}</p>
              {user.name && <p className="text-sm text-gray-600">{user.name}</p>}
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/");
                window.location.reload();
              }}
              className="px-4 py-2 border border-gray-300 font-medium rounded-lg hover:bg-gray-50"
            >
              Logout
            </button>
          </div>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Order history</h2>
            <p className="text-gray-600">You haven&apos;t placed any orders yet.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Account details</h2>
            <Link to="/account/addresses" className="text-gray-700 hover:text-gray-900 underline">
              View addresses (0)
            </Link>
          </section>
        </div>
      )}
    </main>
  );
}
