# Victor Kann Homepage Refresh Handoff

Date: 2026-11-20
Repository: `victorkannx/victorkann`
Base branch: `strategy/lead-flow-check-v1`
Working branch: `refresh/conversion-first-homepage`
Vercel project: `victorkann`

## Goal

Refresh the public homepage around the positioning:

> I build systems that help online businesses turn attention into customers.

Remove the previous public services grid and selected-work/portfolio section. Keep the site focused on the customer journey, the Conversion Leak Scoreboard, an audit-first approach, and a clear enquiry path.

## Implemented

- Replaced the previous homepage structure with a conversion-first landing page.
- Updated navigation to The problem, Scoreboard, My approach, and About.
- Added a five-stage customer-journey visual: attention, capture, response, follow-up, conversion.
- Added an interactive five-question Conversion Leak Scoreboard using the approved five-stage scoring model, with simpler visitor-facing questions, clear completion instructions, and a visible one-answer-per-question workflow.
- Scoring remains 0–2 per stage, total 0–10, and all tied highest-scoring stages are returned as priorities. A zero score returns no priority leak.
- No unapproved score bands or diagnostic benchmarks are presented.
- Added an audit-first explanation and a focused contact CTA.
- Removed service and portfolio sections from the public homepage. Existing assets and non-homepage routes were not deleted.
- Updated enquiry form language for conversion reviews and removed shortlet-specific labels and package pricing.
- The enquiry form explicitly explains that details are not stored by the website and nothing is sent until the visitor chooses to send the prefilled WhatsApp message.
- Applied the brand blue accent `#2499F6` to the site theme and updated page metadata.

## Important limitations

- The Scoreboard currently calculates results in the browser only. It does not persist assessment or lead data, email results, or write to Supabase.
- The contact dialog validates and previews details, then opens a prefilled WhatsApp message addressed to `+2348161123296` and routes the visitor to `/thank-you`.
- The confirmation page clearly tells the visitor to press Send in WhatsApp; the website cannot confirm that the visitor actually sent the message.
- The booking link is `https://cal.com/kanayo/15`.
- The approved backend/data model remains separate work. Do not claim that Scoreboard submissions are saved until the server-side submission path, database migration, security controls, and tests are completed.
- Do not add score interpretation bands without product validation.

## Safety and deployment

- All work is isolated to `refresh/conversion-first-homepage`.
- The branch was created from `strategy/lead-flow-check-v1` to preserve the approved Scoreboard planning work.
- Do not merge to `main`, promote a deployment, or change the `victorkann.com` domain alias as part of this refresh without separate approval.
- No production database, Supabase schema, environment variables, secrets, or DNS settings were changed.
- Keep the existing production deployment on `main` unchanged while reviewing the Preview deployment.

## Review checklist

- [ ] Confirm responsive layout on phone and desktop.
- [ ] Complete all five Scoreboard questions and verify score /10.
- [ ] Verify tied highest stages are all shown.
- [ ] Verify a zero score shows no priority leak.
- [ ] Verify the retake control clears all answers.
- [ ] Verify the result CTA opens the enquiry dialog with the score and priority in its context.
- [ ] Verify the enquiry form review step, WhatsApp handoff, and `/thank-you` instructions.
- [ ] Configure a WhatsApp Business API/provider before claiming automatic owner notifications or verified delivery.
- [ ] Implement the approved server-side lead submission and persistence path before describing enquiries as saved.
- [ ] Confirm no old services or portfolio sections appear on the homepage.
- [ ] Keep production untouched until explicit approval.
