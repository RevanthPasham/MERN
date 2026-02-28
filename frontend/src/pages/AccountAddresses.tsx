import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AccountAddresses() {
  const { user } = useAuth();

  if (!user) return null;


  return (
    <main className="max-w-2xl mx-auto px-4 py-8">

      <h1 className="text-2xl font-bold text-gray-900 mb-4">Addresses</h1>

      <p className="text-gray-600 mb-4">You have no saved addresses.</p>
      <p>try with current address</p>
      
      <Link to="/account" className="text-blue-600 underline">← Back to account</Link>
    </main>
  );
}
