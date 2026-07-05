"use client";

import { useState } from "react";
import {
  Sparkles,
  Package,
  Target,
  AlignLeft,
  Copy,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    productName: "",
    audience: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [copied, setCopied] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.productName || !formData.description) return;

    setLoading(true);
    setResults(null);
    setErrorMessage("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate");
      }

      setResults(data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-[400px] lg:w-[500px] bg-white border-r border-zinc-200 p-8 flex flex-col h-screen sticky top-0 overflow-y-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-zinc-900">
              MarketSpark AI
            </h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Generate high-converting marketing copy in seconds.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="flex-1 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Package className="h-4 w-4" /> Product Name
            </label>
            <input
              type="text"
              placeholder="e.g. EcoBottle Pro"
              className="w-full border border-zinc-200 bg-zinc-50 p-3 text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all rounded-md"
              value={formData.productName}
              onChange={(e) =>
                setFormData({ ...formData, productName: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Target className="h-4 w-4" /> Target Audience
            </label>
            <input
              type="text"
              placeholder="e.g. Gym goers and hikers"
              className="w-full border border-zinc-200 bg-zinc-50 p-3 text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all rounded-md"
              value={formData.audience}
              onChange={(e) =>
                setFormData({ ...formData, audience: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <AlignLeft className="h-4 w-4" /> Key Features & Description
            </label>
            <textarea
              rows="5"
              placeholder="What makes this product special? List features, benefits, or pricing..."
              className="w-full border border-zinc-200 bg-zinc-50 p-3 text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all rounded-md"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formData.productName}
            className="w-full bg-indigo-600 text-white p-4 text-sm font-bold rounded-md hover:bg-indigo-700 transition-all disabled:bg-zinc-300 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            {loading ? (
              <Sparkles className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loading ? "Generating Magic..." : "Generate Marketing Copy"}
          </button>

          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md font-medium">
              ⚠️ {errorMessage}
            </div>
          )}
        </form>
      </div>

      <div className="flex-1 bg-[#F8FAFC] p-8 md:p-12 overflow-y-auto h-screen">
        {!results && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
            <div className="h-24 w-24 bg-zinc-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <Sparkles className="h-10 w-10 text-zinc-300" />
            </div>
            <p className="text-sm font-medium">
              Fill out the form on the left to generate copy.
            </p>
          </div>
        )}

        {loading && (
          <div className="h-full flex flex-col items-center justify-center text-indigo-600 space-y-4 animate-pulse">
            <Sparkles className="h-12 w-12 animate-bounce" />
            <p className="text-sm font-bold tracking-widest uppercase">
              Writing your content...
            </p>
          </div>
        )}

        {results && !loading && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-800">
                  LinkedIn Post
                </h3>
                <button
                  onClick={() => handleCopy(results.linkedin, "linkedin")}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  {copied === "linkedin" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied === "linkedin" ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {results.linkedin}
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-800">
                  Twitter / X
                </h3>
                <button
                  onClick={() => handleCopy(results.twitter, "twitter")}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  {copied === "twitter" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied === "twitter" ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {results.twitter}
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-800">
                  Email Newsletter
                </h3>
                <button
                  onClick={() => handleCopy(results.email, "email")}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  {copied === "email" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied === "email" ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {results.email}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
