# Lead Flow Check: Data Model and Integration Plan

Status: Draft for implementation
Target Supabase project: `victor-kann-x-strategy` (`kquimjniutsgmbgdonmi`, `eu-west-2`)
Working branch: `strategy/lead-flow-check-v1`

## 1. Product contract

The assessment is the lead magnet for Victor Kann's flagship conversion service. The positioning remains:

> I build systems that help online businesses turn attention into customers.

The project brief uses the name **Conversion Leak Scoreboard**. The current implementation direction uses **Lead Flow Check**. Treat Lead Flow Check as the working product/UI name until the brand naming is confirmed; do not silently rename the existing Scoreboard database objects during this pass.

The current agreed assessment shape is:
- Five questions.
- Each answer contributes 0, 1, or 2 points.
- Total score is 0–10.
- Five scored dimensions/stages, one per question.
- The highest-scoring dimension is the priority leak.

Question wording, stage keys/labels, score interpretation bands, and tie-breaking behavior are product decisions and remain explicitly open until approved. Do not invent production copy or result thresholds in code.

## 2. Live database baseline

The live target currently contains:
- `public.scoreboard_leads`
- `public.scoreboard_assessments`

Both tables have RLS enabled and currently contain zero rows. There are three recorded migrations:
- `20261010141646_initial_scoreboard_schema`
- `20261010211724_assessment_idempotency`
- `20261011192035_add_scoreboard_business_context`

Current live assessment constraints are incompatible with the five-question model:
- The trigger currently expects ten answer values.
- The trigger currently expects five stage values from 0–4.
- `total_score` is constrained to 0–20.
- The trigger checks the answer and stage totals but does not currently enforce that `priority_leak` identifies a highest-scoring stage.

The security advisor reports RLS enabled with no policies on both tables. Direct `anon`/`authenticated` table grants were not found in the inspected table grants. Do not add broad public SELECT policies to silence the advisory.

## 3. Canonical assessment payload (proposed)

Use JSON objects with stable stage keys, rather than positional arrays, to make the answer-to-stage relationship explicit and to fit the existing live table/trigger shape.

Example structure only; the keys below are placeholders, not approved product dimensions:

```json
{
  "answers": {
    "stage_1": 0,
    "stage_2": 1,
    "stage_3": 2,
    "stage_4": 0,
    "stage_5": 1
  },
  "stage_scores": {
    "stage_1": 0,
    "stage_2": 1,
    "stage_3": 2,
    "stage_4": 0,
    "stage_5": 1
  },
  "total_score": 4,
  "priority_leak": "stage_3",
  "scoring_version": "lead-flow-check-v1"
}
```

Database invariants:
1. `answers` must be a JSON object with exactly five expected keys.
2. Each answer must be an integer in the inclusive range 0–2.
3. `stage_scores` must be a JSON object with exactly the same five keys and integer values 0–2.
4. `total_score` must equal the sum of the five answers and the sum of the five stage scores, and be between 0 and 10.
5. `priority_leak` must identify a stage whose score equals the maximum stage score.
6. Tie handling must be deterministic and documented. Until approved, the application must not pretend that one tied stage is uniquely worse than another.
7. `scoring_version` is required so historical assessments remain interpretable if questions or scoring change.

## 4. Lead record mapping

Preserve the live lead table and its existing attribution/consent capabilities:
- `id`: generated UUID primary key.
- `email` and generated `email_normalized`: normalized email identity.
- `first_name`: optional.
- `consent_status`, `consent_text_version`, `consented_at`: explicit consent evidence.
- `source` and UTM fields: acquisition attribution.
- `submission_key`: unique idempotency key.
- `business_context`: optional, validated structured business context.
- `created_at`: database timestamp.

Do not collect more personal or business data than the approved form requires. Do not insert fake values to satisfy required legacy columns.

## 5. Submission and access architecture

Preferred security posture:
- Browser submits to a server-side endpoint/server function.
- Server validates the request with a shared schema, normalizes email, validates consent and attribution, and derives the score instead of trusting a browser-supplied total.
- Server uses a server-only Supabase credential. Never expose a service-role/secret key in client code or any `VITE_`/public environment variable.
- Use `submission_key` for idempotency and safe retries.
- Do not return broad lead records to anonymous callers. Return only the minimum result needed by the submitting visitor.
- Admin reads and updates remain behind authenticated server-side role verification and database-side authorization. Preserve the existing admin model; inspect the live role schema before wiring it.
- Keep RLS enabled. Do not add public SELECT/UPDATE/DELETE policies. If direct browser inserts are ever chosen instead, design narrowly scoped INSERT-only policies and test the exact returning behavior before launch.

The existing admin prospect code checks `user_roles` for the admin role. Confirm that the dedicated project's role tables, policies, and auth setup match before reusing it. The Scoreboard migrations previously prepared for a new project mention `private.has_role()`; the live project currently has no policies, so verify that helper and its authorization source before creating admin policies.

## 6. Migration plan (not yet applied)

Prepare a forward-only migration after product dimensions and tie behavior are approved:
1. Preserve table names and existing lead records.
2. Update assessment checks and trigger validation for five answers at 0–2 and five stage scores at 0–2.
3. Change the total score constraint to 0–10.
4. Enforce exact key count, integer-only values, matching totals, valid scoring version, and highest-score priority.
5. Add/verify uniqueness and foreign-key behavior for lead-to-assessment submission idempotency.
6. Revoke any unnecessary API-role privileges; retain only the access model required by the chosen server-side submission flow.
7. Keep admin access restricted. Never create anonymous read access to leads or assessments.
8. Run security and performance advisors and test both allowed and denied access paths.

Do not edit migration history or rewrite existing migrations. Do not apply a schema change until the migration has been reviewed against the live project and local migration tooling is available.

## 7. Acceptance criteria

- Five submitted answers are accepted; four or six are rejected.
- Values outside 0–2, floats, strings, nulls, and unexpected keys are rejected.
- Score is derived and equals 0–10; client-supplied totals cannot override it.
- Stage scores equal the answer values and sum to the total.
- Priority leak is a highest-scoring stage; ties follow the approved rule.
- Repeated submission keys do not create duplicate leads or assessments.
- Anonymous users cannot read, update, or delete lead/assessment records.
- Admin access requires a valid authenticated admin role.
- Consent status and consent version are persisted accurately.
- UTM/source attribution is preserved.
- The public result response contains no unnecessary personal data.
- Tests cover both success and denial cases; advisors are rerun after DDL changes.

## 8. Open decisions before migration

1. Confirm whether the public-facing name is **Lead Flow Check** or **Conversion Leak Scoreboard**.
2. Approve the five question wordings and their five corresponding stage keys/labels.
3. Approve score interpretation bands and the user-facing result copy.
4. Approve tie handling for equal highest stage scores.
5. Confirm the exact lead fields required on the form and the consent wording/version.
6. Confirm the admin roles/users in the dedicated Supabase project.
