import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { CalendarDays, Eye, Loader2, LogOut, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { getAdminProspects, updateAdminProspect } from "@/lib/prospects.functions";
import type { Prospect } from "@/lib/prospects.functions";
import { PROSPECT_STATUSES, currencySymbol } from "@/lib/prospect-config";

const prospectsQueryOptions = queryOptions({
  queryKey: ["admin", "prospects"],
  queryFn: () => getAdminProspects(),
});

export const Route = createFileRoute("/_authenticated/admin/prospects")({
  loader: ({ context }) => context.queryClient.ensureQueryData(prospectsQueryOptions),
  head: () => ({
    meta: [
      { title: "Prospects | Victor Kann" },
      { name: "description", content: "Private prospect management for Victor Kann." },
      { property: "og:title", content: "Prospects | Victor Kann" },
      { property: "og:description", content: "Private prospect management for Victor Kann." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminProspects,
});

function AdminProspects() {
  const queryClient = useQueryClient();
  const updateProspect = useServerFn(updateAdminProspect);
  const { data: prospects = [], isFetching } = useQuery(prospectsQueryOptions);
  const [drafts, setDrafts] = useState<Record<string, { status: string; notes: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const getDraft = (prospect: Prospect) => drafts[prospect.id] ?? { status: prospect.status, notes: prospect.notes ?? "" };

  const updateDraft = (prospect: Prospect, field: "status" | "notes", value: string) => {
    const current = getDraft(prospect);
    setDrafts((previous) => ({ ...previous, [prospect.id]: { ...current, [field]: value } }));
  };

  const saveProspect = async (prospect: Prospect) => {
    const draft = getDraft(prospect);
    setSavingId(prospect.id);
    setSaveError(null);
    try {
      await updateProspect({ data: { id: prospect.id, status: draft.status as (typeof PROSPECT_STATUSES)[number], notes: draft.notes } });
      await queryClient.invalidateQueries({ queryKey: prospectsQueryOptions.queryKey });
    } catch {
      setSaveError(`Could not save ${prospect.name}.`);
    } finally {
      setSavingId(null);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl container-padding py-8 sm:py-12">
        <header className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Private workspace</p>
            <h1 className="display-font mt-3 text-3xl font-bold sm:text-5xl">Prospects</h1>
            <p className="mt-3 text-sm text-muted-foreground">Review enquiries, follow up, and keep the next action clear.</p>
          </div>
          <Button variant="outline" className="gap-2 border-border sm:w-auto" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </header>

        <div className="mt-7 flex items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>{prospects.length} {prospects.length === 1 ? "prospect" : "prospects"}</span>
          {isFetching && <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Refreshing</span>}
        </div>

        {saveError && <p className="mt-4 border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">{saveError}</p>}

        <div className="mt-5 overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="min-w-[1420px] w-full text-left text-sm">
              <thead className="bg-surface-dim text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-4 font-semibold">Prospect</th>
                  <th className="px-4 py-4 font-semibold">Contact</th>
                  <th className="px-4 py-4 font-semibold">Business</th>
                  <th className="px-4 py-4 font-semibold">Need</th>
                  <th className="px-4 py-4 font-semibold">Investment</th>
                  <th className="px-4 py-4 font-semibold">Source</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-4 py-4 font-semibold">Notes</th>
                  <th className="px-4 py-4 font-semibold">Save</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {prospects.map((prospect) => {
                  const draft = getDraft(prospect);
                  return (
                    <tr key={prospect.id} className="align-top hover:bg-surface-dim/50">
                      <td className="w-56 px-4 py-4">
                        <p className="font-semibold">{prospect.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{prospect.country}</p>
                        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" />{new Date(prospect.created_at).toLocaleDateString()}</p>
                      </td>
                      <td className="w-52 px-4 py-4 text-xs">
                        <a className="block hover:underline" href={`mailto:${prospect.email}`}>{prospect.email}</a>
                        <a className="mt-2 block hover:underline" href={`tel:${prospect.whatsapp}`}>{prospect.whatsapp}</a>
                      </td>
                      <td className="w-48 px-4 py-4">
                        <p>{prospect.business_type}</p>
                        <p className="mt-2 text-xs text-muted-foreground">{prospect.service_interest}</p>
                      </td>
                      <td className="w-80 px-4 py-4">
                        <p className="font-medium">{prospect.challenge}</p>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{prospect.desired_outcome}</p>
                      </td>
                      <td className="w-40 px-4 py-4 font-medium">{prospect.investment_range}</td>
                      <td className="w-32 px-4 py-4 text-muted-foreground">{prospect.source ?? "Direct"}</td>
                      <td className="w-44 px-4 py-4">
                        <Select value={draft.status} onValueChange={(value) => updateDraft(prospect, "status", value)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{PROSPECT_STATUSES.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
                        </Select>
                      </td>
                      <td className="w-64 px-4 py-4"><Textarea value={draft.notes} onChange={(event) => updateDraft(prospect, "notes", event.target.value)} rows={3} placeholder="Add a follow-up note" /></td>
                      <td className="w-28 px-4 py-4"><Button size="sm" className="gap-2" disabled={savingId === prospect.id} onClick={() => saveProspect(prospect)}>{savingId === prospect.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}<span className="sr-only">Save {prospect.name}</span></Button>
                        <Dialog>
                          <DialogTrigger asChild><Button size="sm" variant="outline" className="mt-2"><Eye className="h-4 w-4" /><span className="sr-only">View {prospect.name}</span></Button></DialogTrigger>
                          <DialogContent className="max-h-[85vh] overflow-y-auto">
                            <DialogHeader><DialogTitle>{prospect.name}</DialogTitle></DialogHeader>
                            <dl className="grid gap-3 text-sm">
                              {([
                                ["Email", prospect.email], ["WhatsApp", prospect.whatsapp], ["Country", `${prospect.country} (${prospect.currency})`],
                                ["Business type", prospect.business_type], ["Service interest", prospect.service_interest], ["Challenge", prospect.challenge],
                                ["Desired outcome", prospect.desired_outcome], ["Investment range", prospect.investment_range], ["Source", prospect.source ?? "Direct"],
                                ["UTM", [prospect.utm_source, prospect.utm_medium, prospect.utm_campaign, prospect.utm_term, prospect.utm_content].filter(Boolean).join(" / ") || "—"],
                                ["Status", prospect.status], ["Clicked", [prospect.whatsapp_clicked && "WhatsApp", prospect.cal_clicked && "Cal", prospect.email_clicked && "Email"].filter(Boolean).join(", ") || "—"],
                                ["Notes", prospect.notes ?? "—"], ["Created", new Date(prospect.created_at).toLocaleString()],
                              ] as const).map(([k, v]) => (<div key={k}><dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{k}</dt><dd className="mt-1 whitespace-pre-wrap">{v}</dd></div>))}
                            </dl>
                          </DialogContent>
                        </Dialog></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {prospects.length === 0 && <div className="px-5 py-12 text-center text-sm text-muted-foreground">No prospects yet. New form submissions will appear here.</div>}
        </div>
      </div>
    </main>
  );
}