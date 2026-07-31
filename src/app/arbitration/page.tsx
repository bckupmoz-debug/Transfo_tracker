"use client";

import { useState } from "react";
import SourceCard from "@/components/SourceCard";
import { MOCK_ARBITRATIONS } from "@/lib/mock";
import { FIT_GAP, BACKLOG_TARGETS, type FitGapClass, type BacklogTarget } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { supabase } from "@/lib/supabase";

if (!supabase) {
  throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
}

const configuredSupabase = supabase;

async function signInWithKeycloak() {
  await configuredSupabase.auth.signInWithOAuth({
    provider: "keycloak",
    options: { scopes: "openid" }, // required since Keycloak 22
  });
}

export default function Arbitration() {
  const a = MOCK_ARBITRATIONS[0];
  const [fitGap, setFitGap] = useState<FitGapClass | "">("");
  const [target, setTarget] = useState<BacklogTarget>("jira");
  const [note, setNote] = useState("");
  const [resolved, setResolved] = useState<string | null>(null);

  function resolve() {
    if (!fitGap) return;
    // Production: insert backlog_item + arbitration_event, mark arbitration resolved.
    // Routed to and actioned by the transformation lead.
    setResolved(BACKLOG_TARGETS.find((t) => t.value === target)!.label);
  }

  return (
    <div className="space-y-6">
      <section aria-labelledby="arb-h">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="arb-h" className="text-base font-semibold">{a.title}</h2>
          <p className="text-sm text-ink-soft">
            Raised {formatDate(a.created_at)} · routed to <strong className="text-ink">Transformation lead</strong>
          </p>
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          The three streams disagree. Compare them, classify the gap, and resolve into the backlog.
        </p>
      </section>

      <section aria-label="Evidence comparison" className="grid gap-4 md:grid-cols-3">
        <SourceCard source="people" body={a.people_summary} />
        <SourceCard source="documents" body={a.documents_summary} />
        <SourceCard source="system" body={a.system_summary} />
      </section>

      <section aria-labelledby="resolve-h" className="rounded-card border border-line bg-white p-5 shadow-card">
        <h2 id="resolve-h" className="mb-4 text-base font-semibold">Resolve</h2>

        <fieldset className="mb-4">
          <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-soft">Fit-gap classification</legend>
          <div className="flex flex-wrap gap-2">
            {FIT_GAP.map((f) => {
              const sel = fitGap === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={sel}
                  onClick={() => setFitGap(f.value)}
                  className={`rounded-md border px-3 py-2 text-sm font-medium ${
                    sel ? "border-ink bg-people text-ink ring-2 ring-ink" : "border-line bg-white text-ink hover:border-ink/40"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="target" className="text-xs font-medium uppercase tracking-wide text-ink-soft">Backlog destination</label>
            <select
              id="target" value={target}
              onChange={(e) => setTarget(e.target.value as BacklogTarget)}
              className="rounded-md border border-line bg-white px-3 py-2 text-sm text-ink"
            >
              {BACKLOG_TARGETS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="note" className="text-xs font-medium uppercase tracking-wide text-ink-soft">Resolution note</label>
            <input
              id="note" value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="Decision rationale"
              className="rounded-md border border-line bg-white px-3 py-2 text-sm text-ink"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={resolve}
            disabled={!fitGap}
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Resolve &amp; add to backlog
          </button>
          <span className="text-xs text-ink-soft">
            Reversible decision — can be reopened from the audit trail.
          </span>
        </div>

        {resolved && (
          <p role="status" className="mt-4 rounded-md bg-system px-3 py-2 text-sm font-medium text-ink">
            Resolved and queued to {resolved}.
          </p>
        )}
      </section>
    </div>
  );
}
