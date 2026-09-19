# Victor Kanayo systems studio repositioning

## Goal
Reposition the existing homepage as a premium personal business-systems studio while preserving the working enquiry dialog, WhatsApp flow, Cal.com booking link, live shortlet links, email contact, and existing monochrome visual system.

## User-visible changes
- Update the name, positioning, metadata, navigation, hero, and conversion language to “Victor Kanayo — Business Systems & Automation Builder.”
- Replace the current exploratory content with the requested systems-studio narrative: problem, build categories, messy-to-system transformation, selected systems, process, about, engagement pathways, and final CTA.
- Add an elegant animated flow diagram in the hero and restrained reveal/hover interactions without introducing stock imagery, gradients, invented results, or fixed pricing.
- Keep existing shortlet work as one selected-work entry alongside clearly labeled system projects; use reusable arrays/components so future projects are easy to add.
- Preserve mobile navigation usability, responsive layout, current enquiry form, WhatsApp destination, Cal.com link, email address, X link, and live demo URLs. Keep unavailable social URLs omitted rather than invented.

## Technical approach
- Update `src/routes/index.tsx` as the homepage composition with small reusable primitives for headings, CTA buttons, system nodes, services, project entries, process steps, and engagement paths.
- Update `src/styles.css` only where needed for the monochrome editorial tokens and lightweight animation utilities; retain existing semantic tokens and font loading.
- Update leaf and root metadata to the new name, role, topics, and homepage description.
- Validate the homepage in the live preview at desktop and 411px mobile widths, checking navigation, CTAs, external links, the enquiry dialog, and browser console output.
