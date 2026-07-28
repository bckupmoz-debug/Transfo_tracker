import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

type KeycloakProfile = {
  realm_access?: {
    roles?: string[];
  };
};

const keycloakIssuer = process.env.AUTH_KEYCLOAK_ISSUER;
const keycloakClientId = process.env.AUTH_KEYCLOAK_ID;
const keycloakClientSecret = process.env.AUTH_KEYCLOAK_SECRET;

if (!keycloakIssuer || !keycloakClientId || !keycloakClientSecret) {
  throw new Error("Missing Keycloak environment variables. Set AUTH_KEYCLOAK_ISSUER, AUTH_KEYCLOAK_ID, and AUTH_KEYCLOAK_SECRET.");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Keycloak({
      issuer: keycloakIssuer,
      clientId: keycloakClientId,
      clientSecret: keycloakClientSecret,
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      return Boolean(auth?.user);
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }

      const keycloakProfile = profile as KeycloakProfile | undefined;
      token.roles = keycloakProfile?.realm_access?.roles ?? [];

      return token;
    },
    async session({ session, token }) {
      session.user.roles = Array.isArray(token.roles) ? token.roles : [];
      session.accessToken = typeof token.accessToken === "string" ? token.accessToken : undefined;
      return session;
    },
  },
});