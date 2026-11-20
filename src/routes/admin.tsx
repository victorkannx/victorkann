import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, LogOut, Mail, Plus, RefreshCw, Search, ShieldCheck, Users } from "lucide-react";

type Lead = {
  id: string; full_name: string; email: string; whatsapp: string | null; country: string | null;
  business_name: string | null; business_type: string | null; website_url: string | null;
  primary_challenge: string | null; desired_outcome: string | null; status: string;
  source: string; created_at: string; internal_notes: string | null; next_follow_up_at: string | null;
  last_contacted_at: string | null;
};
type Assessment = { total_score: number; attention_score: number; capture_score: number; response_score: number; follow_up_score: number; conversion_score: number; priority_areas: string[]; completed_at: string };
type Activity = { id: string; activity_type: string; subject: string; body: string | null; occurred_at: string };

const ADMIN_EMAIL = "victorkannx@gmail.com";
const statuses = ["new","review_requested","review_booked","review_completed","audit_proposed","audit_active","implementation_proposed","client","nurture","disqualified"];
const pretty = (value: string) => value.replaceAll("_"," ").replace(/\b\w/g, c => c.toUpperCase());
const date = (value?: string | null) => value ? new Date(value).toLocaleString(undefined,{dateStyle:"medium",timeStyle:"short"}) : "Not set";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!supabase) { setChecking(false); setError("Supabase is not configured for this deployment."); return; }
    supabase.auth.getSession().then(({data}) => setSessionEmail(data.session?.user.email ?? null)).finally(() => setChecking(false));
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_event, session) => setSessionEmail(session?.user.email ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const loadLeads = useCallback(async () => {
    if (!supabase || sessionEmail?.toLowerCase() !== ADMIN_EMAIL) return;
    setError("");
    const {data,error:loadError} = await supabase.from("crm_leads").select("*").order("created_at",{ascending:false}).limit(250);
    if (loadError) { setError(loadError.message); return; }
    setLeads((data ?? []) as Lead[]);
  }, [sessionEmail]);

  useEffect(() => { void loadLeads(); }, [loadLeads]);

  const selected = leads.find(lead => lead.id === selectedId) ?? null;
  const loadDetail = useCallback(async (leadId: string) => {
    if (!supabase) return;
    const [a,h] = await Promise.all([
      supabase.from("crm_assessments").select("total_score,attention_score,capture_score,response_score,follow_up_score,conversion_score,priority_areas,completed_at").eq("lead_id",leadId).order("created_at",{ascending:false}).limit(1).maybeSingle(),
      supabase.from("crm_activities").select("id,activity_type,subject,body,occurred_at").eq("lead_id",leadId).order("occurred_at",{ascending:false}).limit(30),
    ]);
    setAssessment((a.data ?? null) as Assessment | null);
    setActivities((h.data ?? []) as Activity[]);
    if (a.error) setError(a.error.message);
    if (h.error) setError(h.error.message);
  },[]);
  useEffect(() => { if (selectedId) void loadDetail(selectedId); else {setAssessment(null);setActivities([]);} },[selectedId,loadDetail]);

  const filtered = useMemo(() => leads.filter(lead => {
    const matches = [lead.full_name,lead.email,lead.business_name ?? "",lead.country ?? ""].join(" ").toLowerCase().includes(query.toLowerCase());
    return matches && (filter === "all" || lead.status === filter);
  }),[leads,query,filter]);

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault(); setError(""); setSent(false);
    if (!supabase) return;
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) { setError("This email is not on the administrator list."); return; }
    const {error:authError} = await supabase.auth.signInWithOtp({email:ADMIN_EMAIL,options:{emailRedirectTo:window.location.origin + "/admin"}});
    if (authError) setError(authError.message); else setSent(true);
  };
  const signOut = async () => { await supabase?.auth.signOut(); setSelectedId(null); };
  const updateLead = async (patch: Partial<Lead>) => {
    if (!supabase || !selected) return;
    setSaving(true); setError("");
    const {error:updateError} = await supabase.from("crm_leads").update(patch).eq("id",selected.id);
    if (updateError) setError(updateError.message); else await loadLeads();
    setSaving(false);
  };
  const addNote = async () => {
    if (!supabase || !selected || !note.trim()) return;
    setSaving(true);
    const {error:noteError} = await supabase.from("crm_activities").insert({lead_id:selected.id,activity_type:"note_added",subject:"Admin note",body:note.trim()});
    if (noteError) setError(noteError.message); else {setNote(""); await loadDetail(selected.id);}
    setSaving(false);
  };

  if (checking) return <Shell><p className="text-sm text-muted-foreground">Checking secure access…</p></Shell>;
  if (!sessionEmail) return <Shell><div className="w-full max-w-md border border-border bg-background p-7 shadow-sm"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary"><ShieldCheck/></div><p className="mt-5 text-xs font-semibold uppercase tracking-[.18em] text-primary">Private workspace</p><h1 className="mt-2 text-3xl font-bold">CRM sign in</h1><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Sign in with the administrator email. We’ll send a secure, one-time access link.</p><form onSubmit={signIn} className="mt-6 space-y-4"><label className="block text-sm font-medium">Administrator email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="mt-2 w-full border border-border bg-background px-3 py-3" /></label><button className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">Send sign-in link</button></form>{sent && <p className="mt-4 text-sm text-green-700">Check your inbox for the secure sign-in link.</p>}{error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}</div></Shell>;
  if (sessionEmail.toLowerCase() !== ADMIN_EMAIL) return <Shell><div className="max-w-md border border-border bg-background p-7"><ShieldCheck className="text-primary"/><h1 className="mt-4 text-2xl font-bold">Access not authorised</h1><p className="mt-2 text-sm text-muted-foreground">This account is not allowed to view the CRM.</p><button onClick={signOut} className="mt-5 rounded-full border border-border px-4 py-2 text-sm">Sign out</button></div></Shell>;

  return <div className="min-h-screen bg-[#f4f8fc] text-foreground"><header className="border-b border-border bg-background"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6"><a href="/" className="font-bold tracking-wide">VICTOR KANN<span className="text-primary">.</span><span className="ml-3 text-xs font-normal text-muted-foreground">CRM</span></a><div className="flex items-center gap-3"><span className="hidden text-xs text-muted-foreground sm:inline">{sessionEmail}</span><button onClick={signOut} className="flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs"><LogOut size={14}/> Sign out</button></div></div></header>
  <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">Private workspace</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Your leads, in one place.</h1><p className="mt-2 text-sm text-muted-foreground">Review enquiries, track progress and keep follow-ups moving.</p></div><button onClick={()=>void loadLeads()} className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm"><RefreshCw size={15}/> Refresh</button></div>
  <div className="mt-7 grid gap-3 sm:grid-cols-3"><Metric label="Total leads" value={leads.length} icon={<Users/>}/><Metric label="New enquiries" value={leads.filter(l=>l.status==="new").length} icon={<Plus/>}/><Metric label="Reviews booked" value={leads.filter(l=>l.status==="review_booked").length} icon={<CalendarDays/>}/></div>
  {error && <p role="alert" className="mt-5 border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
  <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(340px,.9fr)]"><section className="min-w-0 border border-border bg-background"><div className="border-b border-border p-4"><div className="flex flex-wrap gap-3"><div className="relative min-w-[180px] flex-1"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, email or business" className="w-full border border-border py-2.5 pl-9 pr-3 text-sm"/></div><select value={filter} onChange={e=>setFilter(e.target.value)} className="border border-border bg-background px-3 text-sm"><option value="all">All statuses</option>{statuses.map(s=><option key={s} value={s}>{pretty(s)}</option>)}</select></div></div><div className="divide-y divide-border">{filtered.map(lead=><button key={lead.id} onClick={()=>setSelectedId(lead.id)} className={`block w-full p-4 text-left transition-colors hover:bg-[#f4f8fc] ${selectedId===lead.id?"bg-[#edf6ff]":""}`}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold">{lead.full_name}</p><p className="mt-1 truncate text-xs text-muted-foreground">{lead.email}</p><p className="mt-2 truncate text-xs">{lead.business_name || lead.business_type || "Business details not supplied"}</p></div><span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium">{pretty(lead.status)}</span></div><p className="mt-2 text-[11px] text-muted-foreground">{date(lead.created_at)}</p></button>)}{filtered.length===0 && <p className="p-8 text-center text-sm text-muted-foreground">No leads match this view yet.</p>}</div></section>
  <section className="min-w-0 border border-border bg-background p-5 sm:p-6">{selected ? <><button onClick={()=>setSelectedId(null)} className="mb-4 flex items-center gap-2 text-xs text-muted-foreground lg:hidden"><ArrowLeft size={14}/> All leads</button><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">Lead profile</p><h2 className="mt-1 text-2xl font-bold">{selected.full_name}</h2><p className="mt-1 text-sm text-muted-foreground">{selected.email}</p></div><a href={`mailto:${selected.email}`} className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white">Email lead</a></div>
  <div className="mt-5 grid grid-cols-2 gap-3 text-sm"><Info label="Business" value={selected.business_name}/><Info label="Business type" value={selected.business_type}/><Info label="Country" value={selected.country}/><Info label="WhatsApp" value={selected.whatsapp}/><Info label="Website" value={selected.website_url}/><Info label="Submitted" value={date(selected.created_at)}/></div>
  <div className="mt-6 border-t border-border pt-5"><label className="block text-xs font-semibold uppercase tracking-wide">Lead status<select value={selected.status} onChange={e=>void updateLead({status:e.target.value})} disabled={saving} className="mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm">{statuses.map(s=><option key={s} value={s}>{pretty(s)}</option>)}</select></label><div className="mt-4 grid grid-cols-2 gap-3"><label className="text-xs font-semibold">Next follow-up<input type="datetime-local" value={selected.next_follow_up_at ? new Date(new Date(selected.next_follow_up_at).getTime()-new Date(selected.next_follow_up_at).getTimezoneOffset()*60000).toISOString().slice(0,16) : ""} onChange={e=>void updateLead({next_follow_up_at:e.target.value?new Date(e.target.value).toISOString():null})} className="mt-2 w-full min-w-0 border border-border px-2 py-2 text-xs"/></label><label className="text-xs font-semibold">Last contacted<input type="datetime-local" value={selected.last_contacted_at ? new Date(new Date(selected.last_contacted_at).getTime()-new Date(selected.last_contacted_at).getTimezoneOffset()*60000).toISOString().slice(0,16) : ""} onChange={e=>void updateLead({last_contacted_at:e.target.value?new Date(e.target.value).toISOString():null})} className="mt-2 w-full min-w-0 border border-border px-2 py-2 text-xs"/></label></div></div>
  <div className="mt-6 border-t border-border pt-5"><div className="flex items-center justify-between"><h3 className="font-semibold">Scoreboard result</h3>{assessment && <span className="text-lg font-bold text-primary">{assessment.total_score}/10</span>}</div>{assessment ? <><div className="mt-3 grid grid-cols-5 gap-1">{[["Attention",assessment.attention_score],["Capture",assessment.capture_score],["Response",assessment.response_score],["Follow-up",assessment.follow_up_score],["Conversion",assessment.conversion_score]].map(([label,value])=><div key={label} className="bg-[#f1f6fb] p-2 text-center"><p className="text-[9px] text-muted-foreground">{label}</p><p className="mt-1 font-bold">{value}/2</p></div>)}</div><p className="mt-3 text-xs text-muted-foreground">Priority: {assessment.priority_areas?.map(pretty).join(", ") || "No priority areas recorded"}</p></> : <p className="mt-2 text-sm text-muted-foreground">No assessment attached.</p>}</div>
  <div className="mt-6 border-t border-border pt-5"><h3 className="font-semibold">Challenge & desired outcome</h3><p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{selected.primary_challenge || "No challenge provided."}</p><p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{selected.desired_outcome || "No desired outcome provided."}</p></div>
  <div className="mt-6 border-t border-border pt-5"><h3 className="font-semibold">Internal notes</h3><textarea value={selected.internal_notes || ""} onChange={e=>setLeads(current=>current.map(l=>l.id===selected.id?{...l,internal_notes:e.target.value}:l))} rows={3} className="mt-2 w-full border border-border p-3 text-sm" placeholder="Private notes about this lead…"/><button disabled={saving} onClick={()=>void updateLead({internal_notes:selected.internal_notes})} className="mt-2 rounded-full border border-border px-4 py-2 text-xs font-semibold">Save notes</button><div className="mt-4 flex gap-2"><input value={note} onChange={e=>setNote(e.target.value)} placeholder="Add an activity note…" className="min-w-0 flex-1 border border-border px-3 py-2 text-sm"/><button onClick={()=>void addNote()} disabled={saving||!note.trim()} className="rounded-full bg-primary px-3 text-xs font-semibold text-white"><Plus size={15}/></button></div></div>
  <div className="mt-6 border-t border-border pt-5"><h3 className="font-semibold">Activity history</h3><div className="mt-3 space-y-3">{activities.map(item=><div key={item.id} className="flex gap-3"><div className="mt-1 text-primary"><Clock3 size={15}/></div><div><p className="text-sm font-medium">{item.subject}</p><p className="mt-0.5 text-xs text-muted-foreground">{item.body || pretty(item.activity_type)} · {date(item.occurred_at)}</p></div></div>)}{activities.length===0&&<p className="text-sm text-muted-foreground">No activity recorded yet.</p>}</div></div>
  </> : <div className="flex min-h-[420px] flex-col items-center justify-center text-center"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><Users/></div><h2 className="mt-4 text-xl font-bold">Select a lead</h2><p className="mt-2 max-w-xs text-sm text-muted-foreground">Choose an enquiry from the list to view its details, assessment and follow-up history.</p></div>}</section></div>
  </main></div>;
}

function Shell({children}:{children:React.ReactNode}) { return <main className="flex min-h-screen items-center justify-center bg-[#f4f8fc] p-4">{children}</main>; }
function Metric({label,value,icon}:{label:string;value:number;icon:React.ReactNode}) { return <div className="flex items-center justify-between border border-border bg-background p-4"><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold tabular-nums">{value}</p></div><div className="text-primary">{icon}</div></div>; }
function Info({label,value}:{label:string;value:string|null|undefined}) { return <div className="min-w-0"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 break-words text-sm">{value || "Not provided"}</p></div>; }
