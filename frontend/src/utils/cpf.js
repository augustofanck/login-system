export function onlyDigits(value = "") {
  return value.replace(/\D/g, "");
}

export function maskCpf(value = "") {
  const digits = onlyDigits(value).slice(0, 11);

  const p1 = digits.slice(0, 3);
  const p2 = digits.slice(3, 6);
  const p3 = digits.slice(6, 9);
  const p4 = digits.slice(9, 11);

  let out = p1;
  if (digits.length > 3) out += "." + p2;
  if (digits.length > 6) out += "." + p3;
  if (digits.length > 9) out += "-" + p4;

  return out;
}
