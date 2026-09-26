# Fathom app for XP

Enonic XP Application for adding [Fathom Analytics](https://usefathom.com/ref/SVGDJS) tracking script to your website.

Fathom also let you remove the cookie banner on your page, since [it doesn't use cookies](https://usefathom.com/blog/anonymization).

[![](https://repo.itemtest.no/api/badge/latest/releases/no/item/fathom)](https://repo.itemtest.no/#/releases/no/item/fathom)
![Enonic XP8 badge](https://market.enonic.com/badges/xp8.svg)

<img src="https://github.com/ItemConsulting/xp-fathom/raw/main/docs/fathom-logo-small-whitebg.svg?sanitize=true" width="150">

## Installation

This application can be installed from [Enonic Market](https://market.enonic.com/vendors/item-consulting-as/fathom-analytics).

## Usage

### Configuration

When you add the Fathom application to your *site*, you can to configure these fields under site config.

 1. [Fathom site key](https://usefathom.com/docs/script/script) (required)
 2. [Single Page Application mode](https://usefathom.com/docs/script/script-advanced#spa) – `off` for a normal website, or
    Fathom's `auto`, `history` or `hash` mode
 3. [Honor Do Not Track](https://usefathom.com/docs/script/script-advanced#dnt)
 4. [Ignore canonicals](https://usefathom.com/docs/script/script-advanced#canonicals)
 5. [EU isolation](https://usefathom.com/docs/script/eu-isolation) – `extreme` (default) processes all visitors in the EU,
    `standard` only visitors from the EU
 6. Automatically add script to page – (uncheck to not automatically add the script to your page. Useful for headless)

## Development

Building requires JDK 25 (Enonic XP 8 compiles against Java 25).

### Building

```bash
./gradlew build
```

### Deploy locally

Deploy locally for testing purposes:

```bash
enonic project deploy
```

### Releasing

Add a changeset with `npx changeset`. When merged to `main`, CI opens a "Version Packages" pull request, and merging that
publishes the jar to [repo.itemtest.no](https://repo.itemtest.no).
