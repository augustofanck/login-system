export function parseApiError(err) {
  const status = err?.status;

  const data = err?.data && typeof err.data === "object" ? err.data : null;

  const message =
    data?.message ||
    err?.message ||
    "Ocorreu um erro ao processar sua solicitação.";

  const fieldErrors = {};

  const candidate =
    data?.fieldErrors ?? data?.errors ?? data?.violations ?? null;

  if (Array.isArray(candidate)) {
    for (const e of candidate) {
      const field = e.field ?? e.fieldName ?? e.property ?? e.path;
      const msg = e.message ?? e.defaultMessage ?? e.error;
      if (field && msg) fieldErrors[field] = msg;
    }
  } else if (candidate && typeof candidate === "object") {
    for (const [k, v] of Object.entries(candidate)) {
      fieldErrors[k] = Array.isArray(v) ? String(v[0]) : String(v);
    }
  }

  return { status, message, fieldErrors };
}
