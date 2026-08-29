import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Supabase client for use in Server Components, Server Actions and Route Handlers.
 * `cookies()` is async in Next.js 15+ — this helper is always awaited by callers.
 *
 * Writing cookies from a Server Component (not a Server Action / Route Handler)
 * throws — that's expected: middleware/proxy.ts refreshes the session on every
 * request, so a plain page render never needs to write cookies itself.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component render — safe to ignore,
            // proxy.ts already refreshes the session cookie.
          }
        },
      },
    }
  );
}

/**
 * Service-role client for privileged server-only operations (webhooks, admin
 * actions). Never import this from a Client Component or expose the key to
 * the browser — it bypasses Row Level Security entirely.
 */
export function createServiceRoleClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}
