export function getPaymentChipClass(status) {
  switch (status) {
    case "Paid":
      return "chip-paid";
    case "Partial":
      return "chip-partial";
    case "Pending":
      return "chip-pending";
    case "N/A":
    default:
      return "chip-na";
  }
}
