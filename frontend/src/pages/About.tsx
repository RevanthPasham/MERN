import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 md:py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">About GEEK TEE</h1>
      <p className="text-gray-600 mb-6">
        GEEK TEE is a demo clothing storefront built with React, Vite, TypeScript, Tailwind CSS, and a Node.js/Express backend.
        It showcases a complete e‑commerce flow including product browsing, collections, cart, checkout with Razorpay, user
        accounts, addresses, and order history.
      </p>
      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold text-gray-900">Tech stack</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Frontend: React + Vite, TypeScript, Tailwind CSS, React Router</li>
          <li>State: Context for auth and cart</li>
          <li>Backend: Node.js/Express API with PostgreSQL</li>
          <li>Payments: Razorpay checkout integration</li>
        </ul>
      </section>
      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold text-gray-900">What this project demonstrates</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Product listing, collection pages, and search</li>
          <li>Authenticated checkout with saved addresses</li>
          <li>Order history with refund request flow</li>
          <li>Admin panel for orders, products, collections, banners, carts, analytics and settings</li>
        </ul>
      </section>
      <p className="text-gray-600 mb-6">
        You can use this project as a reference or starting point for your own MERN‑style e‑commerce application by
        customizing the design, products, and business logic.
      </p>
      <Link to="/" className="text-blue-600 hover:underline">
        ← Back to home
      </Link>
    </main>
  );
}

