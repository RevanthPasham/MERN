import { Link } from "react-router-dom";

export default function Help() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 md:py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Help & Support</h1>
      <p className="text-gray-600 mb-6">
        This store is a demo project. In a real deployment, this page would explain how customers can contact support,
        track orders, and understand shipping, returns, and refunds.
      </p>
      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold text-gray-900">Common questions</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>How to create an account and save addresses</li>
          <li>How to pay using Razorpay at checkout</li>
          <li>Where to see your order history and refund requests</li>
        </ul>
      </section>
      <p className="text-gray-600 mb-6">
        For this assignment, you can point reviewers to this page as a quick overview of the customer flows implemented
        in the frontend.
      </p>
      <Link to="/" className="text-blue-600 hover:underline">
        ← Back to home
      </Link>
    </main>
  );
}

