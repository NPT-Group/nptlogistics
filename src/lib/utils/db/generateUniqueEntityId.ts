// src/lib/utils/db/generateUniqueEntityId.ts
type ExistsCapableModel = {
  exists(filter: Record<string, unknown>): Promise<unknown>;
};

type GenerateUniqueEntityIdOptions = {
  model: ExistsCapableModel;
  fieldName?: string;
  prefix?: string;
  date?: Date;
  shortSuffixLength?: number;
  longSuffixLength?: number;
  shortAttempts?: number;
  longAttempts?: number;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function randomBase36(length: number) {
  let out = "";
  while (out.length < length) {
    out += Math.random().toString(36).slice(2).toUpperCase();
  }
  return out.slice(0, length);
}

function buildCandidate(prefix: string, suffixLength: number, date = new Date()) {
  const yy = String(date.getUTCFullYear()).slice(-2);
  const mm = pad2(date.getUTCMonth() + 1);
  const dd = pad2(date.getUTCDate());

  return `${prefix}-${yy}${mm}${dd}-${randomBase36(suffixLength)}`;
}

export async function generateUniqueEntityId({
  model,
  fieldName = "quoteId",
  prefix = "NPT",
  date = new Date(),
  shortSuffixLength = 5,
  longSuffixLength = 7,
  shortAttempts = 20,
  longAttempts = 30,
}: GenerateUniqueEntityIdOptions): Promise<string> {
  for (let i = 0; i < shortAttempts; i++) {
    const candidate = buildCandidate(prefix, shortSuffixLength, date);
    const exists = await model.exists({ [fieldName]: candidate });
    if (!exists) return candidate;
  }

  for (let i = 0; i < longAttempts; i++) {
    const candidate = buildCandidate(prefix, longSuffixLength, date);
    const exists = await model.exists({ [fieldName]: candidate });
    if (!exists) return candidate;
  }

  throw new Error(`Failed to generate a unique ${fieldName}`);
}
