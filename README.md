
# translation-helps-rcl

[![Netlify](https://www.netlify.com/img/global/badges/netlify-color-accent.svg)](https://www.netlify.com)
[![Netlify Status](https://api.netlify.com/api/v1/badges/57413041-9de1-4d67-969e-3d5a2cd4225c/deploy-status)](https://app.netlify.com/sites/translation-helps-rcl/deploys)
[![CI Status](https://github.com/unfoldingWord/translation-helps-rcl/workflows/CI/badge.svg)](https://github.com/unfoldingWord/translation-helps-rcl/actions)
[![Current Verison](https://img.shields.io/github/tag/unfoldingWord/translation-helps-rcl.svg)](https://github.com/unfoldingWord/translation-helps-rcl/tags)
[![View this project on NPM](https://img.shields.io/npm/v/translation-helps-rcl)](https://www.npmjs.com/package/translation-helps-rcl)
[![Coverage Status](https://coveralls.io/repos/github/unfoldingWord/translation-helps-rcl/badge.svg?branch=main)](https://coveralls.io/github/unfoldingWord/translation-helps-rcl?branch=main)

A React Component Library for rendering and editing scripture translation resources.

# Development

## Local Development

We use `yalc`[1] to do local development

### Testing Locally With Other Apps

If you are testing locally with another  app (e.g. `gateway-edit`) do the
following:

1. go to your local clone of `translation-helps-rcl`
2. edit `package.json`: 
    1. make "postpublish" non-runnable in scripts
    2. let newVersion = $incrementPatch $currentVersion in
       translation-helps-rcl/package.json __NOTE__: forall source-code changes
       perform this step __BEFORE__ testing local consumer apps.
3. run `yalc publish` 
4. change directories to consumer-app
5. run `yalc add translation-helps-rcl@$newVersion`
6. run `yarn`
7. start testing (typically `yarn (dev | start)`) 

_consumer-app_: the app that consumes `translation-helps-rcl` that needs to be
tested with updates from `translation-helps-rcl`.

## Peer Dependencies

- [Material-UI Versions](https://material-ui.com/versions/)

This package requires @material-ui v4 core, icons, and lab. [Material-UI Installation](https://material-ui.com/getting-started/installation/)

- [Material-UI Styles](https://material-ui.com/styles/basics/)

The CSS Styles implementation uses the updated version and is incompatible with v3.

- [Material-UI Lab](https://material-ui.com/components/about-the-lab/)

A few components use the Lab components such as the Skeleton for the infinite scrolling effect.

[1]: todo include link
