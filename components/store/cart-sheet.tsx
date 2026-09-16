"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cart";
import { useMounted } from "@/hooks/use-mounted";
import { formatPrice } from "@/lib/utils";
import { whatsappCartInquiry } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const mounted = useMounted();
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCartStore();
  const total = totalPrice();

  const handleWhatsApp = () => {
    const url = whatsappCartInquiry(
      items.map((i) => ({
        name: i.name,
        size: i.size,
        color: i.color,
        price: i.price,
        quantity: i.quantity,
      })),
      total
    );
    window.open(url, "_blank");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Inquiry Cart</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col">
          {!mounted || items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
              <p className="text-muted-foreground">Your inquiry cart is empty</p>
              <Button asChild variant="outline" onClick={() => onOpenChange(false)}>
                <Link href="/shop">Browse Dresses</Link>
              </Button>
            </div>
          ) : (
            <>
              <ul className="flex-1 space-y-4 overflow-y-auto py-4">
                {items.map((item) => (
                  <li
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex gap-3 border-b pb-4"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.size && `Size ${item.size}`}
                        {item.size && item.color && " · "}
                        {item.color}
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {formatPrice(item.price)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1,
                              item.size,
                              item.color
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + 1,
                              item.size,
                              item.color
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() =>
                            removeItem(item.productId, item.size, item.color)
                          }
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between font-semibold">
                  <span>Estimated Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <Button
                  variant="whatsapp"
                  className="w-full"
                  onClick={handleWhatsApp}
                >
                  Send Inquiry via WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
