/** "092 2859 555" → "+385922859555" for tel: links. */
export function phoneHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  return `+385${digits.replace(/^0/, "")}`;
}
