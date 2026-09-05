import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem("pos-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("pos-theme", theme);
  }, [theme]);

  const dark = theme === "dark";
  return <button type="button" aria-label={`Switch to ${dark ? "light" : "dark"} mode`} title={`Switch to ${dark ? "light" : "dark"} mode`} onClick={() => setTheme(dark ? "light" : "dark")} className="flex w-full items-center justify-between rounded-xl border border-slate-700 px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white">
    <span className="flex items-center gap-3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]" aria-hidden="true">{dark?<><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></>:<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>}</svg>{dark?"Light mode":"Dark mode"}</span>
    <span className={`h-5 w-9 rounded-full p-0.5 transition ${dark?"bg-orange-500":"bg-slate-600"}`}><span className={`block h-4 w-4 rounded-full bg-white transition-transform ${dark?"translate-x-4":""}`}/></span>
  </button>;
}
