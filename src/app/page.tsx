import { auth, signIn, signOut } from "@/auth";
import Dashboard from "@/components/Dashboard";

const cardClassName = "rounded-card border border-line bg-white p-4 shadow-card";

export default async function Page() {
  const session = await auth();
  const roles = session?.user.roles ?? [];
  const userLabel = session?.user.email ?? session?.user.name ?? "Signed-out user";

  return (
    <div className="space-y-6">
      <section className={`${cardClassName} flex flex-wrap items-center justify-between gap-3`}>
        <div>
          <h1 className="text-xl font-semibold text-ink">Transformation tracker</h1>
          <p className="text-sm text-ink-soft">Secure evidence and workflow visibility for regional delivery teams.</p>
        </div>
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <span className="text-sm text-ink-soft">Signed in as {userLabel}</span>
              <form action={async () => { "use server"; await signOut(); }}>
                <button type="submit" className="rounded-md border border-line px-3 py-2 text-sm font-medium text-ink">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <form action={async () => { "use server"; await signIn("keycloak"); }}>
                <button type="submit" className="rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white">
                  Sign in with Keycloak
                </button>
              </form>
              {/* Sign up link — Keycloak handles user registration when enabled on the realm */}
              <a
                href={`${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/registrations?client_id=${process.env.AUTH_KEYCLOAK_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-line px-3 py-2 text-sm font-medium text-ink"
              >
                Sign up
              </a>
            </div>
          )}
        </div>
      </section>

      {session ? (
        <div className="space-y-3">
          <section className={cardClassName}>
            <h2 className="text-base font-semibold text-ink">Access</h2>
            <p className="text-sm text-ink-soft">Active roles: {roles.length ? roles.join(", ") : "none"}</p>
          </section>
          <Dashboard />
        </div>
      ) : (
        <section className="rounded-card border border-dashed border-line bg-white p-8 text-center shadow-card">
          <h2 className="text-lg font-semibold text-ink">Authenticate to view the programme overview</h2>
          <p className="mt-2 text-sm text-ink-soft">Use your Keycloak account to access the dashboard and role-gated workflows.</p>
        </section>
      )}
    </div>
  );
}
