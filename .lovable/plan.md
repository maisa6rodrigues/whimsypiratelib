## Goal

Move the header emblem (logo) up slightly, and give you a downloadable copy of the logo image.

## Changes

### 1. Move the logo higher
In `src/components/library/Header.tsx`, the emblem is the decorative background image centered behind the title. It's currently vertically centered via `-translate-y-1/2`. I'll shift it up a bit (e.g. change to roughly `-translate-y-[60%]` or adjust the `top` value) so it sits a little higher behind the heading.

### 2. Provide a download link
The logo lives in the repo at `src/assets/chest-emblem.png`. I'll copy it to `/mnt/documents/` and surface it as a downloadable artifact so you can save it to your PC.

## Notes
- Purely a visual/asset task — no data or logic changes.
- After moving the logo I'll verify it still looks centered horizontally and isn't clipped by the radial mask.
