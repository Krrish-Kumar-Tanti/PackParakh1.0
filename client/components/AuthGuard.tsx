"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { Loader2, ShieldCheck } from "lucide-react";

/**
 * Client-side route guard.
 * If user is not authenticated (no google_user_email and no user_authenticated),
 * redirect to /gmail-login?notice=auth-required&next=<currentPath>
 * This stops direct URL typing / footer bypass.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const user = getAuthUser();
    if (!user) {
      const next = pathname || "/";
      router.replace(`/gmail-login?notice=auth-required&next=${encodeURIComponent(next)}`);
    } else {
      setAuthed(true);
    }
    setChecked(true);
  }, [router, pathname]);

  if (!checked) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-slate-500 text-xs">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span>Verifying statutory clearance...</span>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-slate-500 text-xs p-8 text-center">
        <ShieldCheck className="w-8 h-8 text-amber-500" />
        <p className="font-bold text-slate-800">Authentication Required</p>
        <p>Redirecting to Secure Access Gateway...</p>
      </div>
    );
  }

  return <>{children}</>;
}
