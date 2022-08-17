# Fathom app for XP

Enonic XP Application for adding [Fathom Analytics](https://usefathom.com/ref/SVGDJS) tracking script to your website.

Fathom also let you remove the cookie banner on your page, since [it doesn't use cookies](https://usefathom.com/blog/anonymization).

[![](https://jitpack.io/v/no.item/xp-fathom.svg)](https://jitpack.io/#no.item/xp-fathom)

<img src="https://github.com/ItemConsulting/xp-fathom/raw/main/docs/fathom-logo-small-whitebg.svg?sanitize=true" width="150">

## Installation

This application can be installed from [Enonic Market](https://market.enonic.com/vendors/item-consulting-as/fathom-analytics).

 > **Warning** Remember to add Fathom domains to your CORS configuration

## Usage

### Configuration

When you add the Fathom application to your *site*, you can to configure these fields under site config.

 1. [Fathom site key](https://usefathom.com/docs/script/script) (required)
 2. [Tracking type – SPA modes](https://usefathom.com/docs/script/script-advanced#spa)
 3. [Honor Do Not Track](https://usefathom.com/docs/script/script-advanced#dnt)
 4. [Ignore canonicals](https://usefathom.com/docs/script/script-advanced#canonicals)
 5. Automatically add script to page – (uncheck to not automatically add the script to your page. Useful for headless)

## Deploying

### Building

To build he project run the following code

```bash
enonic project build
```

### Deploy locally

Deploy locally for testing purposes:

```bash
enonic project deploy
```

## Deploy to Jitpack

Go to the [Jitpack page for xp-fathom](https://jitpack.io/#no.item/xp-fathom) to deploy from Github.
