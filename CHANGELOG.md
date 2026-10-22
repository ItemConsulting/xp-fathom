# xp-fathom

## 2.0.0

### Major Changes

- 3e23539: The Fathom CDN is now added to the page's Content Security Policy automatically.
- 3e23539: Add an "EU isolation" setting. **It defaults to `extreme`**, which loads Fathom from `cdn-eu.usefathom.com` so that all visitors are processed in the EU.
- 3e23539: The "Tracking type – SPA modes" setting is now "Single Page Application mode", with the options `off`, `auto`, `history` and `hash` passed straight to Fathom's `data-spa` attribute.
- 3e23539: Migrate to Enonic XP 8.
