import { auth } from "@/lib/auth";
import { getSalesExportRows } from "@/services/sales";

function escapeCsv(value: string | number): string {
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rows = await getSalesExportRows();
  const headers = [
    "saleDate",
    "title",
    "type",
    "channel",
    "customerName",
    "customerPhone",
    "totalAmount",
    "paidAmount",
    "status",
    "paymentMethods",
    "notes",
  ] as const;

  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((h) => escapeCsv(row[h])).join(",")
    ),
  ];

  const filename = `ahava-sales-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
