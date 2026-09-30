"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Plus,
  Shield,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  FileText,
  Key,
  X
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import {
  getCurrentUser,
  getVaultItems,
  addVaultItem,
  deleteVaultItem,
  User,
  VaultItem
} from "@/lib/api";
import { encryptClientVault, decryptClientVault } from "@/lib/crypto";

export default function VaultPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<VaultItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  // Add Item Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("Identity");
  const [itemPayload, setItemPayload] = useState("");
  const [passphrase, setPassphrase] = useState("IDoneVaultClientKey2026");
  const [submitting, setSubmitting] = useState(false);
  const [addError, setAddError] = useState("");

  // Decryption preview state
  const [decryptedMap, setDecryptedMap] = useState<Record<string, string>>({});
  const [revealedMap, setRevealedMap] = useState<Record<string, boolean>>({});

  const categories = ["All", "Identity", "Education", "Professional", "Certificates", "Documents"];

  useEffect(() => {
    document.title = "Zero-Knowledge Encrypted Locker | IDone";
    const loadData = async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);
        const vaultData = await getVaultItems(selectedCategory);
        setItems(vaultData);
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedCategory, router]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !itemPayload) {
      setAddError("Please fill in both name and content.");
      return;
    }

    setSubmitting(true);
    setAddError("");

    try {
      // 1. Client-Side WebCrypto AES-256-GCM Encryption
      const encrypted = await encryptClientVault(itemPayload, passphrase);

      // 2. Persist ciphertext only to backend
      await addVaultItem({
        name: itemName,
        category: itemCategory,
        is_encrypted: true,
        encrypted_payload: encrypted.encrypted_payload,
        iv: encrypted.iv,
      });

      setShowAddModal(false);
      setItemName("");
      setItemPayload("");
      const updated = await getVaultItems(selectedCategory);
      setItems(updated);
    } catch (err: any) {
      setAddError(err.message || "Encryption failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleReveal = async (item: VaultItem) => {
    if (revealedMap[item.id]) {
      setRevealedMap({ ...revealedMap, [item.id]: false });
      return;
    }

    // Decrypt on the fly using WebCrypto
    try {
      const decrypted = await decryptClientVault(
        item.encrypted_payload,
        item.iv,
        passphrase
      );
      setDecryptedMap({ ...decryptedMap, [item.id]: decrypted });
      setRevealedMap({ ...revealedMap, [item.id]: true });
    } catch (err) {
      alert("Decryption failed. Invalid cipher or key.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently erase this encrypted item from your vault?")) return;
    try {
      await deleteVaultItem(id);
      setItems(items.filter((i) => i.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete item.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7] dark:bg-[#000000] text-neutral-900 dark:text-white transition-colors duration-300">
      <title>Zero-Knowledge Encrypted Locker | IDone</title>
      <Navbar user={user} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 max-w-6xl min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Zero-Knowledge Storage
              </span>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mt-0.5">
                Encrypted Vault Locker
              </h1>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="apple-btn-primary px-4 py-2 text-xs shadow-xs"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              <span>Add Encrypted Item</span>
            </button>
          </div>

          {/* Security Banner with Emerald Glass Accent */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] dark:bg-emerald-500/[0.1] backdrop-blur-md p-4 mb-6 flex items-start space-x-3 text-xs text-neutral-800 dark:text-neutral-200">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#34C759] to-[#30D158] text-white shadow-xs">
              <Lock className="h-3.5 w-3.5" />
            </div>
            <div className="leading-relaxed">
              <span className="font-bold text-emerald-700 dark:text-emerald-300">Client-Side Authenticated AES-256-GCM:</span> All locker
              payloads are encrypted directly in your browser with random unique IVs prior to transmission. The backend
              never sees or stores your plaintext records.
            </div>
          </div>

          {/* Apple Segmented Category Tabs */}
          <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] backdrop-blur-md border border-black/[0.04] dark:border-white/[0.06] mb-7 w-fit overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-[#34C759] text-white shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Vault Items List */}
          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-20 bg-white dark:bg-[#161618] rounded-2xl border border-black/[0.06] dark:border-white/[0.08]"></div>
              <div className="h-20 bg-white dark:bg-[#161618] rounded-2xl border border-black/[0.06] dark:border-white/[0.08]"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="apple-card p-12 text-center border-dashed border-black/[0.08] dark:border-white/[0.1]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-[#34C759] mx-auto mb-3">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">No Encrypted Items in {selectedCategory}</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                Store sensitive recovery phrases, legal records, or confidential notes with zero plaintext exposure.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="apple-card p-5 transition-all duration-200 hover:border-emerald-500/30 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#34C759] to-[#30D158] text-white flex-shrink-0 shadow-sm shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                        <Lock className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{item.name}</h4>
                          <span className="rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5 font-mono">
                          IV: {item.iv.slice(0, 16)}... • Added{" "}
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleReveal(item)}
                        className="btn-press inline-flex items-center space-x-1 rounded-lg border border-offwhite-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-900 hover:bg-offwhite-100 hover:border-slate-300"
                      >
                        {revealedMap[item.id] ? (
                          <>
                            <EyeOff className="h-3.5 w-3.5" />
                            <span>Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-3.5 w-3.5 text-trust-600" />
                            <span>Decrypt</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn-press rounded p-1.5 text-slate-400 hover:text-alert-600 hover:bg-offwhite-100"
                        title="Delete item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Decrypted or Ciphertext View */}
                  <div className="mt-3 rounded-lg bg-offwhite-50 p-3 border border-offwhite-200">
                    {revealedMap[item.id] ? (
                      <div>
                        <div className="flex items-center space-x-1.5 text-success-700 text-xs font-semibold mb-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Decrypted In Browser Memory</span>
                        </div>
                        <pre className="font-mono text-xs text-navy-900 whitespace-pre-wrap">
                          {decryptedMap[item.id]}
                        </pre>
                      </div>
                    ) : (
                      <div>
                        <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">
                          Stored Ciphertext (AES-GCM Authenticated)
                        </span>
                        <code className="font-mono text-xs text-slate-600 break-all line-clamp-2">
                          {item.encrypted_payload}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/60 p-4 animate-fade-in">
          <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-modal border border-offwhite-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-offwhite-200">
              <h3 className="text-sm font-bold text-navy-900">Add Zero-Knowledge Vault Item</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-press rounded p-1 text-slate-400 hover:bg-offwhite-100 hover:text-navy-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {addError && (
              <div className="mt-3 rounded-lg bg-alert-50 p-2.5 text-xs text-alert-700 border border-alert-100 animate-fade-slide-down">
                {addError}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">Item Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Identity Recovery Seed / Passport Number"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full rounded-lg border border-offwhite-200 px-3 py-2 text-xs text-navy-900 focus:border-trust-600 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">Category</label>
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  className="w-full rounded-lg border border-offwhite-200 bg-white px-3 py-2 text-xs text-navy-900 focus:border-trust-600 focus:outline-none transition-colors"
                >
                  <option value="Identity">Identity</option>
                  <option value="Education">Education</option>
                  <option value="Professional">Professional</option>
                  <option value="Certificates">Certificates</option>
                  <option value="Documents">Documents</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Confidential Plaintext Content
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter secret text, keys, or JSON..."
                  value={itemPayload}
                  onChange={(e) => setItemPayload(e.target.value)}
                  className="w-full rounded-lg border border-offwhite-200 p-3 font-mono text-xs text-navy-900 focus:border-trust-600 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-press rounded-lg border border-offwhite-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-offwhite-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-press rounded-lg bg-navy-900 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-800 disabled:opacity-50 shadow-xs"
                >
                  {submitting ? "Encrypting with AES-GCM..." : "Encrypt & Store"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
