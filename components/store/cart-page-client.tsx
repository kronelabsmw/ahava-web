"use client";

import { useState } from "react";
import { CartSheet } from "./cart-sheet";

export function CartPageClient() {
  const [open, setOpen] = useState(true);
  return <CartSheet open={open} onOpenChange={setOpen} />;
}
