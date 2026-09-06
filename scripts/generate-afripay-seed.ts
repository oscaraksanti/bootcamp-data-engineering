/**
 * Génère le jeu de données AfriPay (fil rouge du bootcamp) en un fichier SQL
 * statique, exécuté une fois par le bac à sable PGlite au premier chargement.
 *
 * Usage : npm run generate:sandbox
 *
 * Volontairement déterministe (seed fixe) : le fichier généré est commité,
 * donc deux exécutions doivent produire un résultat identique.
 */
import { writeFileSync } from "fs";
import { join } from "path";

// PRNG déterministe (mulberry32) — Math.random() suffirait en local, mais un
// seed fixe garantit un diff vide si on regénère sans changer la logique.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20260906);
const pick = <T,>(arr: T[]): T => arr[Math.floor(rnd() * arr.length)];
const int = (min: number, max: number) => min + Math.floor(rnd() * (max - min + 1));
const sqlStr = (s: string) => `'${s.replace(/'/g, "''")}'`;

// ============================================================ PAYS
const COUNTRIES = [
  { code: "CD", name: "République Démocratique du Congo", currency: "CDF", region: "Afrique centrale", tz: "Africa/Kinshasa" },
  { code: "CG", name: "Congo-Brazzaville", currency: "XAF", region: "Afrique centrale", tz: "Africa/Brazzaville" },
  { code: "CI", name: "Côte d'Ivoire", currency: "XOF", region: "Afrique de l'Ouest", tz: "Africa/Abidjan" },
  { code: "SN", name: "Sénégal", currency: "XOF", region: "Afrique de l'Ouest", tz: "Africa/Dakar" },
  { code: "ML", name: "Mali", currency: "XOF", region: "Afrique de l'Ouest", tz: "Africa/Bamako" },
  { code: "KE", name: "Kenya", currency: "KES", region: "Afrique de l'Est", tz: "Africa/Nairobi" },
  { code: "MA", name: "Maroc", currency: "MAD", region: "Afrique du Nord", tz: "Africa/Casablanca" },
  { code: "DZ", name: "Algérie", currency: "DZD", region: "Afrique du Nord", tz: "Africa/Algiers" },
];
const CURRENCIES = [...new Set(COUNTRIES.map((c) => c.currency))];
// Opérateurs mobile money dominants par pays — pour la colonne JSONB channel_metadata
const MOBILE_OPERATORS: Record<string, string[]> = {
  CD: ["Orange Money", "Airtel Money", "M-Pesa"],
  CG: ["Airtel Money", "MTN MoMo"],
  CI: ["Orange Money", "MTN MoMo", "Wave"],
  SN: ["Orange Money", "Wave", "Free Money"],
  ML: ["Orange Money", "Moov Money"],
  KE: ["M-Pesa", "Airtel Money"],
  MA: ["Orange Money Maroc", "inwi money"],
  DZ: ["Djezzy Cash", "Mobilis Money"],
};
const CARD_NETWORKS = ["visa", "mastercard"];
// Taux de départ approximatifs pour 1 USD (ordre de grandeur réaliste, pas des cours financiers réels)
const BASE_RATE: Record<string, number> = { CDF: 2800, XAF: 610, XOF: 610, KES: 129, MAD: 9.9, DZD: 134 };

const FIRST_NAMES = ["Amina","Kwame","Fatou","Jean","Aïcha","Moussa","Grace","Ibrahim","Chantal","Oumar","Aminata","David","Zainab","Patrice","Mariam","Samuel","Rokia","Éric","Awa","Joseph","Hawa","Pierre","Salimata","André","Fatima","Karim","Nadia","Youssef","Leila","Hassan"];
const LAST_NAMES = ["Kabongo","Traoré","Diop","Mukendi","Ben Ali","Keita","Otieno","Alaoui","Nguesso","Camara","Wanjiru","Cissé","Boutros","Ilunga","Sy","Kagame","Coulibaly","El Amrani","Ondo","Diarra"];
const MERCHANT_CATEGORIES = ["Alimentation","Transport","Télécom","Commerce général","Restauration","Services","Énergie","Santé"];
const MERCHANT_PREFIX = ["Marché","Boutique","Station","Pharmacie","Restaurant","Superette","Agence","Atelier"];
const CHANNELS = [
  { v: "mobile_money", weight: 0.62 },
  { v: "carte", weight: 0.23 },
  { v: "virement", weight: 0.15 },
];
function weightedChannel() {
  const r = rnd();
  let acc = 0;
  for (const c of CHANNELS) { acc += c.weight; if (r <= acc) return c.v; }
  return "mobile_money";
}

const START_DATE = new Date("2024-01-01T00:00:00Z");
const END_DATE = new Date("2025-12-31T00:00:00Z");
const DAY_MS = 86400000;
const totalDays = Math.round((END_DATE.getTime() - START_DATE.getTime()) / DAY_MS);

function dateAt(dayOffset: number) {
  return new Date(START_DATE.getTime() + dayOffset * DAY_MS);
}
function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

// Incrémenté à chaque changement de schéma — le bac à sable (SandboxProvider)
// lit cette valeur dans le fichier généré et la compare à celle stockée dans
// IndexedDB pour savoir s'il doit re-seeder plutôt que réutiliser un schéma périmé.
const SANDBOX_SCHEMA_VERSION = 3;

const lines: string[] = [];
lines.push("-- Jeu de données AfriPay — généré, ne pas éditer à la main.");
lines.push("-- Voir scripts/generate-afripay-seed.ts pour régénérer.\n");

// ============================================================ SCHÉMA
lines.push(`
drop table if exists raw_transactions_bronze, fact_transactions, fx_rates, dim_date, dim_agent, dim_merchant, dim_customer, dim_country cascade;

create table dim_country (
  country_code text primary key,
  country_name text not null,
  currency_code text not null,
  region text not null,
  timezone text not null
);

create table dim_customer (
  customer_id serial primary key,
  full_name text not null,
  country_code text references dim_country(country_code),
  signup_date date not null,
  segment text not null check (segment in ('particulier','pme','premium'))
);

create table dim_merchant (
  merchant_id serial primary key,
  merchant_name text not null,
  category text not null,
  country_code text references dim_country(country_code),
  onboarded_date date not null
);

create table dim_agent (
  agent_id serial primary key,
  agent_name text not null,
  manager_id int references dim_agent(agent_id),
  country_code text references dim_country(country_code),
  role text not null check (role in ('regional_manager','field_agent','sub_agent')),
  recruited_date date not null
);

create table dim_date (
  date_key integer primary key,
  date date not null,
  year int not null,
  quarter int not null,
  month int not null,
  week int not null,
  day_of_week int not null,
  is_weekend boolean not null
);

create table fx_rates (
  currency_code text not null,
  rate_date date not null,
  rate_to_usd numeric(14,6) not null,
  primary key (currency_code, rate_date)
);

create table fact_transactions (
  transaction_id serial primary key,
  customer_id int references dim_customer(customer_id),
  merchant_id int references dim_merchant(merchant_id),
  country_code text references dim_country(country_code),
  transaction_at timestamptz not null,
  date_key int references dim_date(date_key),
  amount_local numeric(14,2) not null,
  currency_code text not null,
  channel text not null,
  channel_metadata jsonb,
  status text not null check (status in ('completed','failed','pending'))
);

create table raw_transactions_bronze (
  transaction_id text,
  customer_id text,
  merchant_id text,
  country_code text,
  transaction_at_raw text,
  amount_local text,
  currency_code text,
  channel text,
  status text
);
`);

// ============================================================ DIM_COUNTRY
lines.push("insert into dim_country (country_code, country_name, currency_code, region, timezone) values");
lines.push(
  COUNTRIES.map(
    (c) => `  (${sqlStr(c.code)}, ${sqlStr(c.name)}, ${sqlStr(c.currency)}, ${sqlStr(c.region)}, ${sqlStr(c.tz)})`
  ).join(",\n") + ";"
);

// ============================================================ DIM_CUSTOMER
const CUSTOMER_COUNT = 200;
const customerCountry: string[] = [];
{
  const rows: string[] = [];
  for (let i = 1; i <= CUSTOMER_COUNT; i++) {
    const country = pick(COUNTRIES);
    customerCountry[i] = country.code;
    const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    const signup = isoDate(dateAt(int(0, totalDays - 30)));
    const segment = rnd() < 0.08 ? "premium" : rnd() < 0.25 ? "pme" : "particulier";
    rows.push(`  (${sqlStr(name)}, ${sqlStr(country.code)}, ${sqlStr(signup)}, ${sqlStr(segment)})`);
  }
  lines.push("\ninsert into dim_customer (full_name, country_code, signup_date, segment) values");
  lines.push(rows.join(",\n") + ";");
}

// ============================================================ DIM_MERCHANT
const MERCHANT_COUNT = 50;
const merchantCountry: string[] = [];
{
  const rows: string[] = [];
  for (let i = 1; i <= MERCHANT_COUNT; i++) {
    const country = pick(COUNTRIES);
    merchantCountry[i] = country.code;
    const name = `${pick(MERCHANT_PREFIX)} ${pick(LAST_NAMES)}`;
    const category = pick(MERCHANT_CATEGORIES);
    const onboarded = isoDate(dateAt(int(0, totalDays - 60)));
    rows.push(`  (${sqlStr(name)}, ${sqlStr(category)}, ${sqlStr(country.code)}, ${sqlStr(onboarded)})`);
  }
  lines.push("\ninsert into dim_merchant (merchant_name, category, country_code, onboarded_date) values");
  lines.push(rows.join(",\n") + ";");
}

// ============================================================ DIM_AGENT (hiérarchie — réseau d'agents mobile money)
{
  const rows: string[] = [];
  let nextId = 1;
  const regionalManagerId: Record<string, number> = {};

  for (const country of COUNTRIES) {
    const id = nextId++;
    regionalManagerId[country.code] = id;
    const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    const recruited = isoDate(dateAt(int(0, 60)));
    rows.push(`  (${id}, ${sqlStr(name)}, null, ${sqlStr(country.code)}, 'regional_manager', ${sqlStr(recruited)})`);
  }

  for (const country of COUNTRIES) {
    const fieldAgentCount = int(2, 4);
    for (let i = 0; i < fieldAgentCount; i++) {
      const id = nextId++;
      const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
      const recruited = isoDate(dateAt(int(30, 200)));
      rows.push(
        `  (${id}, ${sqlStr(name)}, ${regionalManagerId[country.code]}, ${sqlStr(country.code)}, 'field_agent', ${sqlStr(recruited)})`
      );
      const subAgentCount = int(0, 3);
      for (let j = 0; j < subAgentCount; j++) {
        const subId = nextId++;
        const subName = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
        const subRecruited = isoDate(dateAt(int(200, totalDays)));
        rows.push(`  (${subId}, ${sqlStr(subName)}, ${id}, ${sqlStr(country.code)}, 'sub_agent', ${sqlStr(subRecruited)})`);
      }
    }
  }

  lines.push("\ninsert into dim_agent (agent_id, agent_name, manager_id, country_code, role, recruited_date) values");
  lines.push(rows.join(",\n") + ";");
  lines.push(`select setval('dim_agent_agent_id_seq', ${nextId - 1});`);
}

// ============================================================ DIM_DATE
{
  const rows: string[] = [];
  for (let d = 0; d <= totalDays; d++) {
    const date = dateAt(d);
    const dateKey = Number(isoDate(date).replace(/-/g, ""));
    const dow = date.getUTCDay();
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const quarter = Math.floor((month - 1) / 3) + 1;
    const week = Math.ceil(d / 7);
    rows.push(
      `  (${dateKey}, ${sqlStr(isoDate(date))}, ${year}, ${quarter}, ${month}, ${week}, ${dow}, ${dow === 0 || dow === 6})`
    );
  }
  lines.push("\ninsert into dim_date (date_key, date, year, quarter, month, week, day_of_week, is_weekend) values");
  lines.push(rows.join(",\n") + ";");
}

// ============================================================ FX_RATES (dérive lente + bruit quotidien)
{
  const rows: string[] = [];
  for (const currency of CURRENCIES) {
    let rate = BASE_RATE[currency];
    for (let d = 0; d <= totalDays; d++) {
      rate *= 1 + (rnd() - 0.48) * 0.004; // légère dérive
      const date = isoDate(dateAt(d));
      rows.push(`  (${sqlStr(currency)}, ${sqlStr(date)}, ${rate.toFixed(6)})`);
    }
  }
  lines.push("\ninsert into fx_rates (currency_code, rate_date, rate_to_usd) values");
  lines.push(rows.join(",\n") + ";");
}

// ============================================================ FACT_TRANSACTIONS
function buildChannelMetadata(channel: string, countryCode: string): string {
  if (channel === "mobile_money") {
    return JSON.stringify({
      operator: pick(MOBILE_OPERATORS[countryCode]),
      device_os: rnd() < 0.75 ? "android" : "ios",
    });
  }
  if (channel === "carte") {
    return JSON.stringify({
      card_network: pick(CARD_NETWORKS),
      last4: String(int(1000, 9999)),
    });
  }
  return JSON.stringify({ bank_reference: `VIR-${int(100000, 999999)}` });
}

const TRANSACTION_COUNT = 5000;
type Txn = {
  customerId: number; merchantId: number; countryCode: string;
  at: Date; amount: number; currency: string; channel: string; status: string;
};
const transactions: Txn[] = [];
{
  const rows: string[] = [];
  const countryOf = (code: string) => COUNTRIES.find((c) => c.code === code)!;
  for (let i = 0; i < TRANSACTION_COUNT; i++) {
    const customerId = int(1, CUSTOMER_COUNT);
    const countryCode = customerCountry[customerId];
    // Le marchand est très majoritairement dans le même pays que le client
    const sameCountryMerchants = Object.keys(merchantCountry)
      .map(Number)
      .filter((id) => merchantCountry[id] === countryCode);
    const merchantId =
      rnd() < 0.9 && sameCountryMerchants.length > 0 ? pick(sameCountryMerchants) : int(1, MERCHANT_COUNT);
    const dayOffset = int(0, totalDays);
    const at = new Date(dateAt(dayOffset).getTime() + int(0, 86399) * 1000);
    const currency = countryOf(countryCode).currency;
    const amount = Math.round((int(500, 45000) / 100) * 100) / 1; // montants ronds, réalistes en devise locale
    const channel = weightedChannel();
    const status = rnd() < 0.04 ? "failed" : rnd() < 0.06 ? "pending" : "completed";
    const dateKey = Number(isoDate(at).replace(/-/g, ""));
    const metadata = buildChannelMetadata(channel, countryCode);
    transactions.push({ customerId, merchantId, countryCode, at, amount, currency, channel, status });
    rows.push(
      `  (${customerId}, ${merchantId}, ${sqlStr(countryCode)}, ${sqlStr(at.toISOString())}, ${dateKey}, ${amount}, ${sqlStr(currency)}, ${sqlStr(channel)}, ${sqlStr(metadata)}, ${sqlStr(status)})`
    );
  }
  lines.push(
    "\ninsert into fact_transactions (customer_id, merchant_id, country_code, transaction_at, date_key, amount_local, currency_code, channel, channel_metadata, status) values"
  );
  lines.push(rows.join(",\n") + ";");
}

// ============================================================ RAW_TRANSACTIONS_BRONZE (volontairement sale)
{
  const rows: string[] = [];
  const sample = transactions.filter(() => rnd() < 0.12); // ~12% du volume, façon extraction quotidienne
  for (const t of sample) {
    const dirty = rnd();
    const id = String(int(100000, 999999));
    const customerId = dirty < 0.05 ? "" : String(t.customerId);
    const amount = dirty < 0.05 ? "" : dirty < 0.1 ? String(t.amount).replace(".", ",") : String(t.amount);
    // Référence marchand orpheline (~2%) — merchant_id qui n'existe pas dans dim_merchant,
    // comme un vrai onboarding pas encore propagé côté référentiel.
    const merchantIdRaw = rnd() < 0.02 ? String(t.merchantId + 1000) : String(t.merchantId);
    // Formats de date incohérents, comme une vraie source mal maîtrisée
    const rawDate =
      dirty < 0.3
        ? t.at.toISOString()
        : dirty < 0.55
          ? `${String(t.at.getUTCDate()).padStart(2, "0")}/${String(t.at.getUTCMonth() + 1).padStart(2, "0")}/${t.at.getUTCFullYear()}`
          : t.at.toISOString().slice(0, 10);
    rows.push(
      `  (${sqlStr(id)}, ${customerId ? sqlStr(customerId) : "null"}, ${sqlStr(merchantIdRaw)}, ${sqlStr(t.countryCode)}, ${sqlStr(rawDate)}, ${amount ? sqlStr(amount) : "null"}, ${sqlStr(t.currency)}, ${sqlStr(t.channel)}, ${sqlStr(t.status)})`
    );
    // Environ 1 doublon sur 10 lignes sales, comme une extraction ré-exécutée
    if (rnd() < 0.1) {
      rows.push(rows[rows.length - 1]);
    }
  }
  lines.push(
    "\ninsert into raw_transactions_bronze (transaction_id, customer_id, merchant_id, country_code, transaction_at_raw, amount_local, currency_code, channel, status) values"
  );
  lines.push(rows.join(",\n") + ";");
}

// ============================================================ VERSION DU SCHÉMA
lines.push(`
drop table if exists _sandbox_version;
create table _sandbox_version (version int not null);
insert into _sandbox_version (version) values (${SANDBOX_SCHEMA_VERSION});
`);

const outPath = join(process.cwd(), "public", "sandbox", "afripay-seed.sql");
writeFileSync(outPath, lines.join("\n") + "\n", "utf-8");
console.log(`✓ Jeu de données AfriPay généré → ${outPath}`);
console.log(`  ${CUSTOMER_COUNT} clients · ${MERCHANT_COUNT} marchands · ${TRANSACTION_COUNT} transactions · ${totalDays + 1} jours de calendrier`);
