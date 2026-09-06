import { SandboxProvider } from "@/components/lesson/SandboxProvider";
import { SqlSandbox } from "@/components/lesson/SqlSandbox";

export default function FreeSandboxPage() {
  return (
    <main className="max-w-4xl mx-auto w-full px-6 py-9">
      <h1 className="font-display font-bold text-2xl text-ink mb-1">Bac à sable SQL</h1>
      <p className="text-ink-soft text-sm mb-2">
        PostgreSQL réel, dans ton navigateur, préchargé avec le jeu de données AfriPay — entraîne-toi librement.
      </p>
      <p className="text-ink-faint text-xs font-mono mb-7">
        Tables disponibles : dim_country · dim_customer · dim_merchant · dim_date · fx_rates · fact_transactions · raw_transactions_bronze
      </p>
      <SandboxProvider>
        <SqlSandbox
          prompt="Écris n'importe quelle requête PostgreSQL sur le jeu de données AfriPay."
          starterQuery={"select c.country_name, count(*) as transactions\nfrom fact_transactions t\njoin dim_country c on c.country_code = t.country_code\ngroup by c.country_name\norder by transactions desc;"}
        />
      </SandboxProvider>
    </main>
  );
}
