import { useState, type ReactNode } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

type IconName = "grid" | "cart" | "box" | "users" | "chart" | "receipt" | "credit" | "settings" | "menu" | "close";
const paths: Record<IconName, ReactNode> = {
  grid:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  cart:<><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 10.4A2 2 0 0 0 9.3 16h8.9a2 2 0 0 0 1.9-1.4L22 8H6"/></>,
  box:<><path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="m3 8 9 5 9-5v8l-9 5-9-5V8Z"/><path d="M12 13v8"/></>,
  users:<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  chart:<><path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 5-7"/></>,
  receipt:<path d="M6 2h12a2 2 0 0 1 2 2v18l-4-2-4 2-4-2-4 2V4a2 2 0 0 1 2-2Zm3 6h6m-6 4h6m-6 4h3"/>,
  credit:<><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h4"/></>,
  settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l-2.8 2.8a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6h-4a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-2.8-2.8a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1v-4a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l2.8-2.8a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6h4a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l2.8 2.8a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1v4a1.7 1.7 0 0 0-1.6 1Z"/></>,
  menu:<path d="M4 6h16M4 12h16M4 18h16"/>, close:<path d="m6 6 12 12M18 6 6 18"/>
};
function Icon({name,className="h-5 w-5"}:{name:IconName;className?:string}) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>{paths[name]}</svg>; }

const links:{label:string;path:string;icon:IconName}[]=[
  {label:"Overview",path:"/dashboard",icon:"grid"},{label:"Point of Sale",path:"/billing",icon:"cart"},{label:"Products",path:"/products",icon:"box"},{label:"Stock",path:"/stock",icon:"receipt"},{label:"Customers",path:"/customer/register",icon:"users"},{label:"Credit System",path:"/credit",icon:"credit"},{label:"Reports",path:"/reports",icon:"chart"}
];

export default function AppShell() {
  const [open,setOpen]=useState(false); const location=useLocation(); const navigate=useNavigate();
  return <div className="min-h-screen bg-slate-100">
    {open&&<button aria-label="Close navigation" className="fixed inset-0 z-40 bg-slate-950/55 lg:hidden" onClick={()=>setOpen(false)}/>}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 px-4 py-5 text-white transition-transform duration-300 lg:translate-x-0 ${open?"translate-x-0":"-translate-x-full"}`}>
      <div className="flex items-center justify-between px-2 pb-8"><button onClick={()=>{navigate("/");setOpen(false)}} className="flex items-center gap-3 text-left"><span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-500 shadow-lg shadow-orange-950/30"><Icon name="receipt"/></span><span><span className="block text-lg font-extrabold tracking-tight">AvinsMart</span><span className="block text-[10px] font-bold uppercase tracking-[.2em] text-slate-400">Business Suite</span></span></button><button aria-label="Close menu" onClick={()=>setOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden"><Icon name="close"/></button></div>
      <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Workspace</p>
      <nav className="space-y-1">{links.map(link=>{const active=link.path==="/"?location.pathname==="/":location.pathname.startsWith(link.path);return <NavLink key={link.label} to={link.path} onClick={()=>setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active?"bg-orange-500 text-white shadow-lg shadow-orange-950/20":"text-slate-400 hover:bg-slate-800 hover:text-white"}`}><Icon name={link.icon} className="h-[18px] w-[18px]"/><span className="whitespace-nowrap">{link.label}</span></NavLink>})}</nav>
      <div className="mt-auto space-y-2"><ThemeToggle/><button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"><Icon name="settings" className="h-[18px] w-[18px]"/>Settings</button></div>
    </aside>
    <button aria-label="Open navigation" onClick={()=>setOpen(true)} className="fixed bottom-5 left-5 z-30 grid h-12 w-12 place-items-center rounded-xl bg-slate-900 text-white shadow-xl lg:hidden"><Icon name="menu"/></button>
    <div className="min-h-screen lg:pl-64"><Outlet/></div>
  </div>;
}
