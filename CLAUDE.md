# Standing rules for Claude working on this repo / pipeline

## Always triple-check a fix before saying "fixed"

When the user asks to fix something (in this repo, in the Netlify deploy, or in the
Make.com/Google Sheets SEO pipeline that publishes into this repo), never report
"fixed" on the strength of "I pushed a change" or "the deploy succeeded" alone.
Before telling the user it's fixed, verify from every angle actually available:

1. The fix is really in the deployed/applied artifact, not just committed
   (re-fetch the live blueprint/file/config after applying, don't assume the
   apply call worked).
2. The build/deploy completed with zero errors (check deploy state, not just
   that a deploy exists).
3. The specific failure mode that was reported is addressed by the change —
   re-derive *why* it broke, not just what looks plausible.
4. Check for related/adjacent breakage the fix could have introduced, not just
   the one symptom reported.

If a live check against the production site is required and can't be done
directly (e.g. network egress to the site is blocked in the session), say so
explicitly and ask the user to do that one specific check — don't silently
skip it, and don't claim "fixed" while that gap is open. Be honest about the
line between what was actually verified and what's inferred.

Do this every time, without being asked again. The standard: never make the
user find out three days later, from someone else, that something wasn't
actually fixed.
