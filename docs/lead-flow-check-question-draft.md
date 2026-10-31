# Conversion Leak Scoreboard: Five-Question Assessment v1

Status: **Approved for v1 implementation**  
Public-facing working label: **Conversion Leak Scoreboard**  
Implementation identifier: `lead-flow-check-v1`

## Scoring

Each answer is scored by leak severity:
- **0 — Working:** the process is reliable and repeatable.
- **1 — Inconsistent:** the process exists but breaks or depends on manual effort.
- **2 — Leaking:** the process is missing, unclear, or frequently missed.

The total is the sum of the five answers, from 0 to 10. A higher score means more conversion friction.

## Approved stages and questions

| Order | Stage key | Stage | Question | 0 points | 1 point | 2 points |
|---:|---|---|---|---|---|---|
| 1 | `attention` | Turn attention into action | When someone discovers your business, is the next step to enquire or buy obvious? | Clear CTA across key touchpoints | CTA exists but is inconsistent or easy to miss | No clear next step |
| 2 | `capture` | Capture interested leads | Can an interested visitor leave their details in a simple, reliable way? | Leads are captured in one reliable place | Some leads are captured, but channels are fragmented | No consistent lead-capture process |
| 3 | `response` | Respond to enquiries | Do new enquiries receive a useful response within one business day? | Reliably within one business day | Sometimes delayed or missed | Frequently delayed or unanswered |
| 4 | `follow_up` | Follow up consistently | Does every unconverted lead receive a planned follow-up? | Repeatable follow-up is in place | Follow-up happens, but depends on memory/manual effort | No consistent follow-up |
| 5 | `conversion` | Track conversion | Can you see which enquiries become paying customers and where others drop off? | Enquiry-to-sale progress is visible | Tracking is partial or scattered | No reliable way to track conversion |

## Priority leak and ties

The priority leak is the stage or stages with the highest individual score. If multiple stages tie for the highest score, show every tied stage. If all five scores are zero, there is no priority leak and the priority list is empty.

The assessment data model must represent priority leaks as an array of stage keys, not a single text value.

## Result bands

Result bands and their explanatory copy remain **unapproved**. Do not hard-code the earlier suggested 0–3, 4–7, and 8–10 bands as authoritative diagnosis until they are validated against real audit conversations. The exact score and highest-scoring stages can be shown without inventing a benchmark.

## Product positioning and next step

The lead magnet supports the positioning:

> I build systems that help online businesses turn attention into customers.

The Scoreboard should lead into the flagship conversion service once its final name and scope are locked. Do not introduce unrelated secondary offers into this flow.

## Acceptance criteria

- Exactly five questions appear in the approved order.
- Each answer accepts only 0, 1, or 2.
- Total score is derived from the five answers and stays within 0–10.
- Stage scores use exactly the five keys listed above.
- Every tied highest-scoring stage is returned as a priority leak.
- A zero total returns an empty priority-leak array.
- Scoring version is stored as `lead-flow-check-v1`.
- No unapproved score bands or claims are presented as established facts.
