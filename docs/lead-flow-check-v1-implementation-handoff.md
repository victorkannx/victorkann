# Conversion Leak Scoreboard v1: Implementation Handoff

Date: 2026-10-31
Task: Approve and prepare the five-stage assessment for implementation
Priority: P1

## A. Authorization and scope

Victor explicitly approved proceeding with the five proposed stages and questions. This authorizes the v1 assessment design and isolated feature-branch preparation.

Allowed:
- Update documentation on `strategy/lead-flow-check-v1`.
- Prepare implementation and migration plans.
- Inspect the dedicated Supabase project, GitHub branch, and Vercel preview configuration.

Not authorized in this task:
- Apply database DDL or alter the live database.
- Change Vercel environment variables or secrets.
- Deploy to production or alter the live website.
- Publish X posts or perform X account actions.

## B. Verified project state

### Supabase
- Dedicated project `victor-kann-x-strategy`: `ACTIVE_HEALTHY`.
- Project ref: `kquimjniutsgmbgdonmi`.
- Region: `eu-west-2`.
- X Dispatcher project `ggrtolgclbecnfwpomqk`: `INACTIVE`.
- PostgreSQL 17.11.0.003.
- `public.scoreboard_leads`: 0 rows, RLS enabled.
- `public.scoreboard_assessments`: 0 rows, RLS enabled.
- Live migration history: `20261010141646_initial_scoreboard_schema`, `20261010211724_assessment_idempotency`, `20261011192035_add_scoreboard_business_context`.
- Live trigger currently expects 10 answers and five stage scores from 0–4; total score allows 0–20. It does not enforce the approved five-key model.
- `priority_leak` is currently text, not an array.
- Both tables have no RLS policies. The inspected grants show `postgres` and `service_role` only; no `anon` or `authenticated` table grants were present. This is fail-closed and should remain so while the server-side submission path is built.
- Security advisor reports two INFO findings: RLS enabled with no policies. This is intentional until a specific access model is added.
- Performance advisor reports three unused indexes. Do not remove them during this feature task.

### GitHub
- Repository: `victorkannx/victorkann`.
- Working branch: `strategy/lead-flow-check-v1`.
- Branch was created from `strategy/lead-capture-audit`.
- Approved question and data-model documents have been updated on the working branch.
- The branch's `supabase/config.toml` still points to a different project ref (`qguhydbhcenzphackqnz`), not the dedicated project.
- The branch's generated Supabase types do not yet include the live `scoreboard_leads` or `scoreboard_assessments` tables.
- The live migration history files were not found at their recorded paths on the working branch. Do not assume the repository migration folder matches the live database history.

### Vercel
- Project: `victorkann`.
- Inspected environment-variable metadata without decrypting secrets.
- Current visible environment variables are Preview-only and point to a Lovable Cloud backend, not the dedicated Supabase project.
- No server-only Supabase secret/service-role variable was present in the returned environment metadata.
- No production environment variables were returned.
- Therefore the new feature branch is not yet safely wired to the dedicated Supabase project.

## C. Root cause / confidence

Confirmed mismatch: the database exists and is active, but the repo config and Vercel Preview environment still reference another backend. The current app's generated types also omit the live Scoreboard tables.

Confidence: high; directly observed in Supabase project metadata, live schema, GitHub files, and Vercel environment metadata.

## D. Approved v1 assessment

Stage keys and order:
1. `attention`
2. `capture`
3. `response`
4. `follow_up`
5. `conversion`

Scoring:
- 0 = working
- 1 = inconsistent
- 2 = leaking

Total: 0–10. Priority leaks are all stages tied for the maximum. If all five scores are zero, the priority list is empty. Score bands remain unapproved and must not be presented as validated diagnostic benchmarks.

## E. Required implementation sequence

1. Align the branch's Supabase project configuration with the dedicated project only after confirming the intended preview workflow.
2. Reconcile live migration history with repository migration files; obtain a proper local project checkout and Supabase CLI.
3. Create a new CLI-generated forward-only migration. Do not hand-invent a migration filename.
4. Migration changes: strict five-key JSON validation; integer-only numeric 0–2 answers; stage-score equality; derived 0–10 total; derived ordered `text[]` priority list; empty list when total is zero; required scoring version; unique assessment submission key after duplicate check.
5. Preserve the lead table's consent and attribution fields, foreign key, RLS, and restricted grants.
6. Add a server-side anonymous submission function using a server-only secret. It must validate the request, persist lead and assessment atomically, enforce idempotency, and return only the assessment result.
7. Confirm a server-only Supabase secret is securely configured in Vercel Preview. Do not use a public `VITE_` key for privileged writes.
8. Generate updated Supabase TypeScript types from the dedicated project and update app code.
9. Implement the approved five-question UI and result screen.
10. Add unit, integration, duplicate-submission, malformed-payload, tie, zero-score, and authorization tests.
11. Run security and performance advisors. Deploy to Preview only after explicit environment/deployment authorization. Verify Preview reaches Ready and test the live route.

## F. Blockers

- Supabase CLI is not installed in the current execution environment. The required `supabase migration new` workflow cannot be performed here. Do not substitute a manually invented migration file name.
- Vercel Preview still points at Lovable Cloud and has no server-only Supabase secret.
- Repo Supabase project ref and generated types are stale relative to the dedicated database.
- Result interpretation bands and consent copy/version still need product decisions before public launch.

## G. Gate status

- Authorization/scope: PASS for assessment design and isolated branch documentation.
- Diagnosis: PASS for current state inspection.
- Implementation: PARTIAL; approved docs updated, no application or database changes.
- Testing: NOT RUN; no implementation exists yet.
- Deployment: NOT RUN; not authorized.
- Live verification: NOT RUN; no new deployment.

## H. Next action

Establish a proper local checkout of `victorkannx/victorkann`, install/use a stable Supabase CLI, reconcile the remote migration history, and generate a reviewed forward-only migration on `strategy/lead-flow-check-v1`. Keep all database and Vercel Preview mutations pending explicit approval.

## I. Next prompt

Act as lead engineer for `victorkannx/victorkann`. Continue from branch `strategy/lead-flow-check-v1` and dedicated Supabase project `kquimjniutsgmbgdonmi` (eu-west-2). The five-stage Conversion Leak Scoreboard v1 assessment is approved: `attention`, `capture`, `response`, `follow_up`, `conversion`; each answer is an integer 0–2; total 0–10; return all tied highest stages, or an empty priority list when total is zero.

First establish a proper local checkout and stable Supabase CLI. Inspect current CLI version and help before using commands. Reconcile repository migration history with the live project history; do not assume the current branch's migrations match the live database. Create the migration with `supabase migration new`, then write and review the forward-only SQL. The live assessment trigger currently validates ten answers and total 0–20, while the approved design requires five exact keys, integer-only values, stage-score equality, database-derived total, derived priority array, scoring version, and assessment submission-key uniqueness. Preserve RLS and do not create anonymous read/update/delete access.

Inspect the Vercel Preview environment metadata without decrypting values. It currently points to a Lovable Cloud backend and lacks a server-only Supabase secret. Do not change Vercel variables or apply the migration yet. Prepare a precise environment and migration plan, including rollback and test strategy, then request approval before any hosted database or environment mutation.

Required tests: malformed JSON/value/key rejection, 5-answer acceptance, 0–10 derived score, tie handling, zero-score behavior, duplicate idempotency, atomic lead/assessment persistence, and denial of anonymous reads/updates/deletes. Run advisors after DDL. Do not deploy without separate authorization. Return evidence, gate status, blockers, and the next prompt.

Follow the project's Master Engineering Prompt and current project state. Inspect the latest evidence, perform the next authorized action, verify the result, update the handoff, and automatically generate the next actionable prompt. Continue this cycle without requiring the user to ask for the next prompt. Never skip a required gate or claim unverified success.
