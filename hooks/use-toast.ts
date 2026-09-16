"use client";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    if (typeof document === "undefined") return;

    const el = document.createElement("div");
    el.setAttribute("role", "status");
    el.className = [
      "fixed bottom-4 right-4 z-[100] max-w-sm rounded-xl border px-4 py-3 text-sm shadow-lg transition-opacity",
      variant === "destructive"
        ? "border-red-200 bg-red-50 text-red-900"
        : "border-[#E8EBE4] bg-white text-[#2D3328]",
    ].join(" ");

    if (title) {
      const strong = document.createElement("strong");
      strong.className = "block font-medium";
      strong.textContent = title;
      el.appendChild(strong);
    }

    if (description) {
      const p = document.createElement("p");
      p.className = "mt-1 text-xs opacity-80";
      p.textContent = description;
      el.appendChild(p);
    }

    document.body.appendChild(el);
    window.setTimeout(() => {
      el.style.opacity = "0";
      window.setTimeout(() => el.remove(), 200);
    }, 4000);
  };

  return { toast };
}
