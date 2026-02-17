"use client";

import { useState, FormEvent } from "react";

interface SearchBarProps {
  onSearch: (symbol: string) => void;
  loading: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [input, setInput] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-md">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value.toUpperCase())}
        placeholder="Enter a ticker (e.g. AAPL)"
        className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors"
      />
      <button
        type="submit"
        disabled={!input.trim()}
        className="rounded-lg bg-slate-700 px-5 py-3 text-sm font-medium text-slate-100 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Loading..." : "Search"}
      </button>
    </form>
  );
}
