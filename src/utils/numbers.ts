function formatNumber(num: bigint): string {
  const billion = BigInt(1e9);
  const million = BigInt(1e6);
  const thousand = BigInt(1e3);

  if (num >= billion) {
    const billions = (num / billion).toString();
    return billions.endsWith("000")
      ? billions.slice(0, -3) + "B"
      : billions + "B";
  }

  if (num >= million) {
    const millions = (num / million).toString();
    return millions.endsWith("000")
      ? millions.slice(0, -3) + "M"
      : millions + "M";
  }

  if (num >= thousand) {
    const thousands = (num / thousand).toString();
    return thousands.endsWith("000")
      ? thousands.slice(0, -3) + "K"
      : thousands + "K";
  }

  return num.toString();
}

export { formatNumber };
