"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminPrimaryButtonClass } from "@/components/admin/admin-ui";
import { BrandLogo } from "@/components/store/brand-logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-[#556347] via-[#6B7B52] to-[#4A5640] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div>
          <BrandLogo
            variant="full"
            href={null}
            onDark
            className="[&_img]:h-16 [&_img]:max-w-none"
          />
          <p className="mt-10 text-sm font-medium uppercase tracking-[0.22em] text-white/60">
            Admin portal
          </p>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
            Manage products, bookings, inquiries, and storefront content from one
            elegant dashboard.
          </p>
        </div>
        <p className="text-sm text-white/50">
          Bridal boutique management · Secure access only
        </p>
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -right-10 top-1/3 h-40 w-40 rounded-full bg-white/5" />
      </div>

      <div className="flex flex-1 items-center justify-center bg-[#F3F5F0] p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <BrandLogo variant="compact" href={null} className="mb-4" />
            <h1 className="text-2xl font-bold text-[#2D3328]">Sign in</h1>
          </div>

          <div className="rounded-2xl border border-[#E8EBE4] bg-white p-8 shadow-[0_4px_24px_rgba(45,51,40,0.08)]">
            <div className="mb-6 hidden lg:block">
              <h2 className="text-xl font-bold text-[#2D3328]">Welcome back</h2>
              <p className="mt-1 text-sm text-[#8A9480]">
                Enter your credentials to access the admin panel.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-[#3D4538]">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1.5 h-11 rounded-xl border-[#E8EBE4] bg-[#F7F9F5] focus-visible:ring-[#6B7B52]/30"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-[#3D4538]">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1.5 h-11 rounded-xl border-[#E8EBE4] bg-[#F7F9F5] focus-visible:ring-[#6B7B52]/30"
                />
              </div>
              {error && (
                <p className="rounded-lg bg-[#FCEAEA] px-3 py-2 text-sm text-[#9B3A3A]">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className={`h-11 w-full ${adminPrimaryButtonClass}`}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
