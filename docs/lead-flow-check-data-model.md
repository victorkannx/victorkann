# Lead Flow Check: Data Model and Integration Plan

Status: Approved v1 assessment design; database implementation pending
Target Supabase project: `victor-kann-x-strategy` (`kquimjniutsgmbgdonmi`, `eu-west-2`)
Working branch: `strategy/lead-flow-check-v1`

## 1. Product contract

The public-facing lead magnet remains **Conversion Leak Scoreboard**. The implementation/scoring version is `lead-flow-check-v1`.

Positioning:

> I build systems that help online businesses turn attention into customers.

The approved assessment has five questions and five stages in this order:
1. `attention` — When someone discovers your business, is the next step to enquire or buy obvious?
2. `capture` — Can an interested visitor leave their details in a simple, reliable way?
3. `response` — Do new enquiries receive a useful response within one business day?
4. `follow_up` — Does every unconverted lead receive a planned follow-up?
5. `conversion` — Can you see which enquiries become paying customers and where others drop off?

Each answer is an integer from 0 to 2:
- 0 = working
- 1 = inconsistent
- 2 = leaking

Total score is 0–10. Higher means more conversion friction. Score interpretation bands remain unapproved and must not be hard-coded as authoritative.

## 2. Verified live database baseline (2026-10-31)

The dedicated Supabase project is now `ACTIVE_HEALTHY`:
- Name: `victor-kann-x-strategy`
- Ref: `kquimjniutsgmbgdonmi`
- Region: `eu-west-2`
- PostgreSQL: 17.11.0.003

X Dispatcher is confirmed `INACTIVE` (paused).

The target project contains two empty tables, both with RLS enabled:
- `public.scoreboard_leads` (0 rows)
- `public.scoreboard_assessments` (0 rows)

Recorded migrations:
- `20261010141646_initial_scoreboard_schema`
- `20261010211724_assessment_idempotency`
- `20261011192035_add_scoreboard_business_context`

The live trigger `private.validate_scoreboard_assessment()` currently expects 10 answer values (0–2) and five stage scores (0–4). The existing total constraint allows 0–20. This does not match the approved v1 contract and must be changed.

The live `priority_leak` is currently a single text column. V1 needs to represent all tied highest-scoring stages, so change it to `text[]` in a forward-only migration. When total score is zero, store an empty array; otherwise store all tied maximum-score stage keys in approved stage order.

The assessment table currently has a `submission_key` column, but the inspected schema did not show it as unique. Add uniqueness after confirming no existing duplicate values (table is currently empty).

## 3. Canonical assessment structure

```json
{
  "answers": {
    "attention": 0,
    "capture": 1,
    "response": 2,
    "follow_up": 0,
    "conversion": 1
  },
  "stage_scores": {
    "attention": 0,
    "capture": 1,
    "response": 2,
    "follow_up": 0,
    "conversion": 1
  },
  "total_score": 4,
  "priority_leak": ["response"],
  "scoring_version": "lead-flow-check-v1"
}
```

The example is illustrative only. The database trigger must derive `total_score` and `priority_leak` from validated answers; do not trust browser-supplied totals or priorities.

Validation invariants:
1. `answers` is a JSON object with exactly the five approved keys.
2. Each answer is a JSON number representing an integer 0, 1, or 2. Reject strings, floats, booleans, nulls, arrays, and unexpected keys.
3. `stage_scores` is an object with exactly the same five keys and each score equals the corresponding answer.
4. `total_score` is derived as the sum of answers and is between 0 and 10.
5. `priority_leak` is derived as an ordered array containing all keys tied at the maximum score; if the total is zero, it is an empty array.
6. `scoring_version` must be `lead-flow-check-v1`.

## 4. Lead record mapping

Preserve the existing live lead table and its fields:
- `id`: generated UUID primary key.
- `email` and generated `email_normalized`: normalized email identity.
- `first_name`: optional.
- `consent_status`, `consent_text_version`, `consented_at`: explicit consent evidence.
- `source` and UTM fields: acquisition attribution.
- `submission_key`: unique idempotency key.
- `business_context`: optional validated structured context.
- `created_at`: database timestamp.

Do not add unapproved mandatory form fields or fabricate defaults to satisfy constraints.

## 5. Submission and access architecture

The current repo uses TanStack Start server functions and a Supabase publishable-key client. The inspected auth middleware validates signed-in user claims; it is not suitable as-is for an anonymous lead-magnet submission.

Preferred flow:
- Add a dedicated public server function for Scoreboard submission.
- Validate input server-side with Zod (or the existing shared schema).
- Normalize email, validate consent and attribution, and generate/validate a submission key.
- Use a server-only Supabase secret/service-role credential from server environment only. Never expose it through `VITE_`, browser code, logs, or generated client types.
- Insert lead and assessment atomically so a failed assessment cannot leave a partial lead. Use the unique submission key for safe retries.
- Return only the minimum score/result payload to the browser, never the lead row or private CRM data.
- Keep admin reads behind authenticated server-side role verification and database-side authorization.
- Do not add anonymous SELECT, UPDATE, or DELETE policies.
- Keep RLS enabled. The current tables have no policies; this is currently a fail-closed posture. The security advisor reports this as informational. Do not add permissive policies merely to clear the advisory.

Before implementing the server function, confirm the secret environment variable exists in the intended Vercel runtime by name only. If absent, create a secure setup task; do not fall back to a public key for privileged writes.

## 6. Migration plan (not applied)

The database is empty, but the migration must still be forward-only and preserve existing table names and lead structure.

Required DDL:
1. Alter `scoreboard_assessments.priority_leak` from `text` to `text[]`.
2. Replace the 0–20 check with a 0–10 check.
3. Replace the trigger body with strict five-key JSON validation and DB-derived score/priority logic.
4. Require the exact scoring version.
5. Add unique constraint/index for assessment `submission_key` after duplicate check.
6. Keep existing foreign key from assessment to lead.
7. Preserve RLS and keep anonymous direct table access closed if using the server-only submission path.
8. Inspect actual table grants and Data API exposure before wiring clients. Supabase announced a change to Data API table exposure defaults on 2026-10-30; do not assume newly created or altered tables are reachable from the API.
9. Run security/performance advisors and test positive and negative access paths.

Do not rewrite existing migration history. Do not apply DDL until a CLI-generated migration is reviewed and explicitly approved for the dedicated project.

## 7. Acceptance criteria

- Exactly five answers are accepted; four or six are rejected.
- Only the five approved stage keys are accepted.
- Only numeric integer values 0–2 are accepted.
- Stage scores exactly match answers.
- Server/database derive total score 0–10.
- All tied maximum stages are returned in stable stage order.
- A zero total returns no priority leak.
- Repeated submission keys do not create duplicate leads or assessments.
- Lead and assessment are committed atomically.
- Anonymous users cannot read, update, or delete lead/assessment records.
- Admin access requires an authenticated admin role.
- Consent status/version and UTM attribution are persisted accurately.
- Public response contains no unnecessary personal data.
- Tests cover malformed payloads, duplicate submissions, ties, zero-score case, and denied access.
- Advisors are rerun after DDL changes.

## 8. Remaining implementation decisions

- Confirm exact consent wording and consent text version.
- Decide which optional business-context fields are worth collecting at v1; do not add them by default.
- Validate result interpretation bands through real audit conversations before shipping them.
- Confirm server-side Supabase secret availability in Vercel.
- Confirm the dedicated project's admin role source before wiring CRM reads.
