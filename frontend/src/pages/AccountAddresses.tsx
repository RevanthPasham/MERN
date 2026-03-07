import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as api from "../api/client";
import type { AddressDto, AddressType } from "../types";

const ADDRESS_TYPES: AddressType[] = ["Home", "Work", "Other"];

const emptyForm = {
  fullName: "",
  phoneNumber: "",
  country: "India",
  state: "",
  city: "",
  area: "",
  streetAddress: "",
  landmark: "",
  postalCode: "",
  addressType: "Home" as AddressType,
  isDefault: false,
};

export default function AccountAddresses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<AddressDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    api
      .getAddresses()
      .then(setAddresses)
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (a: AddressDto) => {
    setEditingId(a.id);
    setForm({
      fullName: a.fullName,
      phoneNumber: a.phoneNumber,
      country: a.country,
      state: a.state,
      city: a.city,
      area: a.area,
      streetAddress: a.streetAddress,
      landmark: a.landmark ?? "",
      postalCode: a.postalCode,
      addressType: a.addressType as AddressType,
      isDefault: a.isDefault,
    });
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.fullName?.trim() || !form.phoneNumber?.trim() || !form.streetAddress?.trim() || !form.city?.trim() || !form.state?.trim() || !form.area?.trim() || !form.postalCode?.trim()) {
      setError("Please fill all required fields.");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await api.updateAddress(editingId, {
          fullName: form.fullName.trim(),
          phoneNumber: form.phoneNumber.trim(),
          country: form.country.trim(),
          state: form.state.trim(),
          city: form.city.trim(),
          area: form.area.trim(),
          streetAddress: form.streetAddress.trim(),
          landmark: form.landmark?.trim() || null,
          postalCode: form.postalCode.trim(),
          addressType: form.addressType,
          isDefault: form.isDefault,
        });
      } else {
        await api.createAddress({
          fullName: form.fullName.trim(),
          phoneNumber: form.phoneNumber.trim(),
          country: form.country.trim(),
          state: form.state.trim(),
          city: form.city.trim(),
          area: form.area.trim(),
          streetAddress: form.streetAddress.trim(),
          landmark: form.landmark?.trim() || null,
          postalCode: form.postalCode.trim(),
          addressType: form.addressType,
          isDefault: form.isDefault,
        });
      }
      const list = await api.getAddresses();
      setAddresses(list);
      closeForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.setDefaultAddress(id);
      const list = await api.getAddresses();
      setAddresses(list);
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await api.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch {
      // ignore
    }
  };

  if (!user) return null;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Addresses</h1>
      <Link to="/account" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to account
      </Link>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {addresses.map((a) => (
              <div
                key={a.id}
                className={`border rounded-lg p-4 ${a.isDefault ? "border-green-600 bg-green-50/50" : "border-gray-200"}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    {a.isDefault && (
                      <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded mr-2">
                        Default
                      </span>
                    )}
                    <span className="text-sm font-medium text-gray-500">{a.addressType}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(a)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    {!a.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(a.id)}
                        className="text-sm text-gray-600 hover:underline"
                      >
                        Set default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(a.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="font-medium text-gray-900 mt-1">{a.fullName}</p>
                <p className="text-sm text-gray-600">{a.phoneNumber}</p>
                <p className="text-sm text-gray-700 mt-1">
                  {a.streetAddress}, {a.area}, {a.city}, {a.state} {a.postalCode}, {a.country}
                </p>
                {a.landmark && <p className="text-sm text-gray-500">Landmark: {a.landmark}</p>}
              </div>
            ))}
          </div>

          {!showForm && (
            <button
              type="button"
              onClick={openAdd}
              className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              + Add new address
            </button>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
              <h2 className="font-semibold text-gray-900">{editingId ? "Edit address" : "New address"}</h2>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="text"
                  value={form.phoneNumber}
                  onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area / Locality *</label>
                <input
                  type="text"
                  value={form.area}
                  onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street address *</label>
                <input
                  type="text"
                  value={form.streetAddress}
                  onChange={(e) => setForm((f) => ({ ...f, streetAddress: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (optional)</label>
                <input
                  type="text"
                  value={form.landmark}
                  onChange={(e) => setForm((f) => ({ ...f, landmark: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal code *</label>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address type</label>
                <select
                  value={form.addressType}
                  onChange={(e) => setForm((f) => ({ ...f, addressType: e.target.value as AddressType }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  {ADDRESS_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={form.isDefault}
                  onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  Set as default address
                </label>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingId ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </main>
  );
}
