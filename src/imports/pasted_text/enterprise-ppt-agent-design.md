Product context

Design the UI for Enterprise PPTX Agent — an internal corporate tool that
generates professional PowerPoint presentations from a plain-text brief, powered
by an LLM or running in stub mode when no API key is available.

Primary users: enterprise knowledge workers (analysts, strategists, consultants)
who need polished decks fast without touching PowerPoint themselves.

The single job of the UI: take a brief in, get a .pptx download out. Everything
else — configuration, options, progress — should recede so the brief can be the hero.


Design system

Color palette (exact hex values)

TokenHexUsage--navy#1E2761Hero gradient start, primary actions--navy-mid#2D5A8EHero gradient mid--teal#0A9396Gradient end, accent, slider thumb, active toggle--teal-light#94D2BDSidebar product subtitle--slate#1E2533Sidebar background--slate-mid#2A3248Sidebar input backgrounds--slate-border#3D4F6ESidebar borders and dividers--slate-text#DDE3F0All sidebar text--canvas#F7F8FAPage background--white#FFFFFFCard and input backgrounds--text-primary#111827Main body text--text-muted#6B7280Labels, secondary text--border#E5E7EBCard and input borders--green-bg#D4EDDASuccess badge background--green-text#155724Success badge text--amber-bg#FFF3CDWarning badge background--amber-text#856404Warning badge text--red-bg#F8D7DAError badge background--red-text#721C24Error badge text--log-bg#0D1117Terminal log area--log-text#C9D1D9Terminal log text

Typography


Font family: Inter (Google Fonts)
Weights in use: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
Scale:

Hero H1: 26px / 700 / letter-spacing −0.02em
Section label: 14px / 700 / UPPERCASE / letter-spacing 0.06em / color --text-muted
Field label: 13px / 500 / --text-primary
Sidebar section marker: 10px / 700 / UPPERCASE / letter-spacing 0.1em / --slate-border
Sidebar field label: 12px / 600 / UPPERCASE / letter-spacing 0.06em / --slate-text
Body / inputs: 14px / 400
Badge text: 12px / 600
Log text: 12px / 400 / monospace





Spacing


Page padding: 36px top/bottom, 40px left/right
Between sections: 28–36px
Between fields: 14px
Card internal padding: 20px
Input padding: 8–10px × 12px


Border radius


Hero, card: 12–14px
Inputs, selects, buttons: 8px
Badges: 20px (pill)
Slide type chips: 4px


Elevation

No shadows. Distinction comes from background-color changes only (white card on --canvas background; no box-shadow).


Layout — Desktop (1280px reference frame)

Overall shell

┌──────────────────────────────────────────────────────────────────┐
│  Sidebar 280px  │              Main content 900px                │
│  (slate #1E2533)│              (canvas #F7F8FA)                  │
└──────────────────────────────────────────────────────────────────┘

Fixed-width sidebar, fluid main (max 900px with 40px padding each side).


Screen 1 — Idle (default state)

Sidebar

Top to bottom:


Product logo area (28px bottom margin)

"PPTX Agent" — 18px / 700 / white
"Enterprise Edition" — 11px / 400 / --teal-light, 2px below



Section marker: "LLM PROVIDER" — 10px uppercase / --slate-border
Provider select (dropdown):

Label: "Provider" — 12px / 600 / uppercase / --slate-text
Select field — bg --slate-mid, border --slate-border, text --slate-text
Options: Disabled (stub mode) | OpenAI | Azure OpenAI | Compatible endpoint



(When provider ≠ disabled — shown conditionally):

API Key field (password type, placeholder "sk-…")
Model field (default "gpt-4o")
Endpoint URL field (Azure and Compatible only)
API Version field (Azure only)



Horizontal rule — 1px / --slate-border / 16px vertical margin
Section marker: "TEMPLATE"
Upload button — full-width, bg --slate-mid, border --slate-border, text --slate-text

Copy: "Upload corporate .pptx"
Icon: upload icon left-aligned, 14px



Horizontal rule
Section marker: "ADVANCED"
Toggle — Per-slide enrichment

Custom toggle pill: inactive = --slate-border, active = --teal
Label 13px / 500 / --slate-text
Hint below: "Second LLM pass per slide. Slower." — 11px / --text-muted



Output directory field — label + input, same style as other sidebar inputs
Status badge (bottom of sidebar, pushed to bottom)

AI disabled state: amber pill "Stub mode"
AI enabled state: green pill "AI enabled"






Main content — Idle

Hero banner (full width, gradient #1E2761 → #2D5A8E → #0A9396, 135° angle, 14px radius):


H1: "Enterprise PPTX Agent" — 26px / 700 / white
Subtitle: "Generate professional PowerPoint presentations from a topic — AI-powered or in stub mode." — 15px / 400 / white 82% opacity
Internal padding: 32px vertical / 36px horizontal


Two-column grid (gap 28px, ratio 1fr × 340px):

Left column — "Presentation Brief" section label above:


Topic textarea — label "Topic", 4 rows, placeholder text in muted gray, white bg, 8px radius, 1px --border
Extra instructions textarea — label "Extra instructions" with "(optional)" in muted weight, 3 rows


Right column — "Options" section label above:


Audience input — text input
Slide count slider

Label row: "Number of slides" left-aligned, current value right-aligned in --teal / 700
Range slider with --teal accent color
Min/max labels: "3" and "30" below, 11px / --text-muted



Tone select — options: professional / executive / technical / casual
Language select — full language names (English, German, French, Spanish, Italian, Portuguese, Dutch)


Generate button (full width, below grid):


Gradient bg: #1E2761 → #0A9396 (135°)
Text: "Generate Presentation" — 15px / 700 / white
Border radius: 10px
Height: 48px
Disabled state: flat gray #9CA3AF, same text



Screen 2 — Generating state

Same layout as idle, with button showing "Generating…" and disabled, plus progress panel appearing below the button.

Progress panel (white card, 1px --border, 12px radius)

Header row (14px padding, border-bottom):


Running badge: amber pill "Running"
Status message text: current step description — 13px / --text-muted


Progress bar section (12px padding, border-bottom):


Full-width track — 6px height, --border background, 3px radius
Fill: gradient --navy → --teal, animates width smoothly
"47%" right-aligned below — 12px / --text-muted


Log terminal (no border-bottom):


Background --log-bg (#0D1117)
Text --log-text (#C9D1D9)
Monospace 12px
Max height 200px, scrolls vertically
Each line: [pct%] message
Scrolls to bottom as new lines appear



Screen 3 — Complete state

Progress panel updates:

Header row:


Badge changes to green "Complete"
Status message: "Complete"


Progress bar: filled 100%

Log terminal: shows final log entries

Action row (below log, 16px padding, flex row, 12px gap):


"Download .pptx" button — bg --teal, white text, 10×20px padding, 8px radius, 14px / 600
"Show slide plan (N slides)" button — bg --canvas, border --border, same sizing



Screen 4 — Slide plan expanded

Appears below the progress panel as a separate white card.

Card header (12px × 20px padding, border-bottom):


"{Presentation title} — slide plan" — 13px / 600


Slide rows (repeat for each slide):
Each row: horizontal flex, align-center, 8px × 12px padding, border-bottom 1px --border


Index — 12px / --text-muted / right-aligned in 22px column
Type chip — pill with type-specific bg/text colors (see table below), 11px / 600, 4px radius
Title — 13px / --text-primary / flex 1


Slide type chip colors

TypeBackgroundTexttitle_slide#EDE9FE#5B21B6section_header#DBEAFE#1E40AFbullets#D1FAE5#065F46two_column#FEF3C7#92400Etable#FCE7F3#9D174Dchart#E0F2FE#0C4A6Eclosing#F3F4F6#374151content#F0FDF4#14532D


Screen 5 — Error state

Progress panel:


Header badge: red "Failed"
Below log: red 13px error message text



Component inventory (for Figma component library)

Create these as reusable components with variants:

ComponentVariantsBadgetype: ok / warn / errSidebarInputdefault / focusSidebarSelectdefault / focusToggleon / offTextareaFieldempty / filled / focusInputFieldempty / filled / focus / passwordSelectFielddefault / openSliderFieldany valuePrimaryButtondefault / hover / disabled / loadingSecondaryButtondefault / hoverProgressBar0–100% (use number prop)LogTerminalempty / populatedSlideRowfor each slide type variantTypeChipone variant per slide type (8 total)HeroBannersingle variantProgressPanelstate: running / complete / error


Frames to create in Figma


App/Idle — 1440×900px, sidebar + main, default form
App/Idle – AI Enabled — same but with AI inputs shown, green badge
App/Generating — progress panel in running state, 47% progress
App/Complete — 100%, download + plan buttons visible
App/Plan Expanded — complete + slide plan card below
App/Error — red badge + error message
Component Library — all components on a single frame
Mobile/Idle — 390×844px, sidebar collapses to top nav drawer



Interaction notes for prototyping


Sidebar toggle: clicking the toggle pill switches between on/off variants
Provider select: changing to non-"disabled" reveals the API Key, Model, and optional fields below
Generate button: hover state darkens gradient slightly (use opacity overlay); disabled state is flat gray
Progress panel: slides down from below the button (Smart Animate, ease-out, 300ms)
Slide plan: expands below progress panel (auto-layout height change, 200ms)
Template upload: after file selection, button label changes to "✓ filename.pptx" with a remove link below



What to avoid


No drop shadows
No gradients on inputs or cards (gradients only on hero and generate button)
No colored sidebar stripes or decorative accent lines under headings
No rounded corners on single-sided borders
Sidebar inputs must stay on --slate-mid background (not white)
Do not lighten the sidebar — it must remain the full dark --slate (#1E2533)