const baht = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** จัดรูปแบบราคาเป็นเงินบาท เช่น 1290 -> "฿1,290" */
export function formatBaht(amount: number): string {
  return baht.format(amount);
}
