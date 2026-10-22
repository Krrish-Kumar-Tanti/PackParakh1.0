import Link from "next/link";
import { SearchX, ArrowLeft, ShieldCheck } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-16 text-center bg-slate-50">
      <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 mb-4">
        <SearchX className="w-7 h-7" />
      </div>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold tracking-widest uppercase mb-3">
        <ShieldCheck className="w-3 h-3 text-amber-400" />
        404 — Resource Not Found
      </div>
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">This page could not be found</h1>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        The requested Legal Metrology resource does not exist or has been moved. Return to the National Gateway.
      </p>
      <Link href="/" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  );
}
