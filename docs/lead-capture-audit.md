# Victor Kann Website Engine: Lead Capture Audit

Date: 2026-10-10
Repository: https://github.com/victorkannx/victorkann
Audited branch: main
Audited commit: a4a9f8244eb920b6b70491a52862a6965bd1deec

## Scope

This is the first build-order checkpoint: inspect the existing website form, CRM schema, Supabase configuration and repository deployment constraints before changing production behavior.

## Findings

### 1. Existing enquiry form is not connected to the CRM

`src/components/lead-form-dialog.tsx` validates form values with Zod, displays a review step, and then opens a prefilled WhatsApp message. The submit path does not insert a row into Supabase. The current form captures name, email, WhatsApp number, project/site name, requested features, budget and notes.

### 2. The current form does not match the existing prospects schema

The migration `supabase/migrations/20260918153119_187224ec-541a-4f73-83a4-8c9dbf957157.sql` defines `public.prospects` with required fields including `country`, `business_type`, `service_interest`, `challenge`, `desired_outcome` and `investment_range`. The form currently does not collect all of these fields. Its current values cannot safely be inserted into this table without an intentional mapping or a product decision about the form/schema contract.

The existing schema also includes source/UTM attribution fields and a `submission_id` unique index for duplicate protection.

### 3. Existing Supabase project identity is unresolved

The repository's Supabase client reads `VITE_SUPABASE_URL` / `SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_PUBLISHABLE_KEY` from environment configuration. The correct environment values were not inspected or copied into this document.

The connected Supabase account lists projects named `supabase-orange-ball` (inactive), `Sell In DMs` (active), `OneLink Funnel` (inactive) and `PINTEREST AUTOMATION` (inactive). None is clearly named for the Victor Kann website. Read-only table discovery attempts against the two inactive candidates timed out. Do not assume or modify any of these databases until the website's configured project ref is confirmed.

### 4. Existing admin and security structure should be preserved

The repository includes authenticated admin routes and migrations for role-gated prospect reading/updating. The existing RLS and admin access policies should be reviewed against the confirmed database before making schema changes. Do not expose prospect reads to anonymous visitors.

### 5. Repository workflow constraint

`AGENTS.md` states that the repository is connected to Lovable and warns against rewriting published Git history. Work should use ordinary commits and a preview-first workflow; do not force-push or rewrite history.

## Recommended implementation sequence

1. Confirm the Supabase project ref configured for the Victor Kann website, without exposing secret keys.
2. Inspect the live `public.prospects` table, applied migrations, RLS policies, admin role setup and security advisors in that exact project.
3. Decide whether to adapt the form to the existing schema or create a deliberate, minimal schema change. Avoid filling required business fields with fabricated defaults.
4. Implement an explicit typed submission path with server/database validation, `submission_id` duplicate protection, source and UTM attribution, accessible loading/error/success states, and no public read access.
5. Keep WhatsApp as a follow-up action after a successful submission rather than the only persistence mechanism.
6. Run lint/build checks and test the end-to-end flow on a preview deployment before promoting it.

## Current status

Audit completed from repository source and migrations. No application files, production database, secrets, or deployment configuration were changed in this audit. The CRM integration is blocked until the correct Supabase project is identified and its live schema/policies can be verified.
