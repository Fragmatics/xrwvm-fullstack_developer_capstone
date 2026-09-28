import React, { useState, useEffect, useRef } from 'react';

// Searchable dropdown for picking a state. Calls onSelect with the state
// name, or "All" for every state, just like the original <select>.
const StateFilter = ({ states, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);

  const options = [{ value: "All", label: "All States" }, ...states.map(s => ({ value: s, label: s }))];
  const matches = options.filter(o => o.label.toLowerCase().includes(query.trim().toLowerCase()));

  // Close when clicking anywhere outside the dropdown
  useEffect(() => {
    const onClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setHighlight(0);
      searchRef.current && searchRef.current.focus();
    }
  }, [open]);

  // Keep the highlighted option scrolled into view
  useEffect(() => {
    const el = listRef.current && listRef.current.children[highlight];
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [highlight]);

  const choose = (option) => {
    setSelected(option.value);
    setOpen(false);
    onSelect(option.value);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight(h => Math.min(h + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight(h => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (matches[highlight]) choose(matches[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const selectedLabel = selected === "" ? "State" : selected === "All" ? "All States" : selected;

  return (
    <div ref={rootRef} className="relative w-56">
      <button
        type="button"
        id="state"
        className="form-input flex items-center justify-between py-2 text-left"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className={selected === "" ? "text-slate-400" : "text-slate-900"}>{selectedLabel}</span>
        <svg viewBox="0 0 20 20" className={`h-4 w-4 text-slate-400 transition ${open ? "rotate-180" : ""}`} fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.2 7.2a.75.75 0 0 1 1.06 0L10 10.94l3.74-3.74a.75.75 0 1 1 1.06 1.06l-4.27 4.27a.75.75 0 0 1-1.06 0L5.2 8.26a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
          <div className="border-b border-slate-100 p-2">
            <div className="relative">
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              <input
                ref={searchRef}
                type="text"
                value={query}
                placeholder="Search states..."
                aria-label="Search states"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/15"
                onChange={(e) => { setQuery(e.target.value); setHighlight(0); }}
                onKeyDown={onKeyDown}
              />
            </div>
          </div>
          <ul ref={listRef} role="listbox" className="max-h-64 overflow-y-auto py-1">
            {matches.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-slate-400">No states match &ldquo;{query}&rdquo;</li>
            ) : matches.map((option, i) => (
              <li
                key={option.value}
                role="option"
                aria-selected={selected === option.value}
                className={`mx-1 flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm ${i === highlight ? "bg-brand-50 text-brand-700" : "text-slate-700"} ${option.value === "All" ? "font-medium" : ""}`}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => { e.preventDefault(); choose(option); }}
              >
                {option.label}
                {selected === option.value && (
                  <svg viewBox="0 0 20 20" className="h-4 w-4 text-brand-600" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.58l7.3-7.3a1 1 0 0 1 1.4 0Z" clipRule="evenodd"/></svg>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StateFilter;
