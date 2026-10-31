# Lead Flow Check: Five-Question Draft

Status: Proposed copy and scoring, not approved for production
Related design: [Lead Flow Check data model](./lead-flow-check-data-model.md)

## Scoring direction

This draft uses a **leak-severity score**:
- **0 = working:** the process is reliable and repeatable.
- **1 = inconsistent:** the process exists but breaks or depends on manual effort.
- **2 = leaking:** the process is missing, unclear, or frequently missed.

A higher total therefore means more conversion friction. The total is five answers added together, out of 10. The highest-scoring stage is the strongest candidate for the priority leak.

## Proposed questions

| Stage key | Stage | Question | 0 points | 1 point | 2 points |
|---|---|---|---|---|---|
| attention | Turn attention into action | When someone discovers your business, is the next step to enquire or buy obvious? | Clear CTA across key touchpoints | CTA exists but is inconsistent or easy to miss | No clear next step |
| capture | Capture interested leads | Can an interested visitor leave their details in a simple, reliable way? | Leads are captured in one reliable place | Some leads are captured, but channels are fragmented | No consistent lead-capture process |
| response | Respond to enquiries | Do new enquiries receive a useful response within one business day? | Reliably within one business day | Sometimes delayed or missed | Frequently delayed or unanswered |
| follow_up | Follow up consistently | Does every unconverted lead receive a planned follow-up? | Repeatable follow-up is in place | Follow-up happens, but depends on memory/manual effort | No consistent follow-up |
| conversion | Track conversion | Can you see which enquiries become paying customers and where others drop off? | Enquiry-to-sale progress is visible | Tracking is partial or scattered | No reliable way to track conversion |

## Suggested result interpretation (not yet locked)

- 0–3: Flow is mostly working. Look for one small improvement.
- 4–7: There are meaningful leaks. Fix the weakest stage first.
- 8–10: The path from attention to customer is breaking in multiple places. Prioritize the largest leak before adding more traffic.

These bands are a starting hypothesis. Validate them against real audit conversations before using them as claims about business performance.

## Tie handling

If two or more stages share the highest score, show all tied stages as priority leaks rather than implying that one is uniquely worse. The current live `priority_leak` column is a single text value, so the implementation design must be updated to represent ties (for example, a JSON array of priority stage keys) before this behavior is shipped.

## Approval checklist

- Confirm the five stages and question wording.
- Confirm the answer anchors (0/1/2).
- Confirm the score bands and result copy.
- Confirm whether the result should show all tied priority leaks.
- Confirm whether the public-facing name is Lead Flow Check or Conversion Leak Scoreboard.
