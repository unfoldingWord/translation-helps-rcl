
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
    2. let $currentVersion = $localRepo/package.version 
       let $newVersion = $incrementPatch $currentVersion in
       translation-helps-rcl/package.json __NOTE__: forall source-code changes
       perform this step __BEFORE__ testing local consumer apps.
3. run `yalc publish` 
4. change directories to consumer-app
    - ensure to checkout `develop` branch to test the changes
5. run `yalc add translation-helps-rcl@$newVersion`
6. run `yarn`
7. start testing (typically `yarn (dev | start)`) 

_consumer-app_: the app that consumes `translation-helps-rcl` that needs to be
tested with updates from `translation-helps-rcl`.

# Dev Process / Publishing

The following is a psudo-code of our PR/QA Process

```
`let $latestPublishedVersion = <pull latest non-beta version from npm>`
1. in library
  `let $betaVersion = $incrementBetaVersion $latestPublishedVersion`
  `let $newLatestVersion = $incrementVersion $latestPublishedVersion` 
  1. publish $betaVersion to npm from local machine
  2. update package.json to $newLatestVersion 
  3. Create a commit and push
  4. Create PR 
    `let LibPrLink = PRlink`
    `let PRLibDesc = <write pr description>`
    1. mark PR as draft
    2. add reviewers to PR
    3. set PR status to in review
    4. `let AppReviewLinks = LibPrLink`

6. ∀.app ∈ consumer-apps 
  1. update the `<lib>@$latestPublishedVersion` to `<lib>@$betaVersion` in app/package.json
  2. create a commit and push
  3. create a PR
    `let PRLink`
    `let PRdescription = <write pr description> + <write testing steps>`
    `AppReviewLinks += PRLink`
    1. mark PR as draft
    3. ensure a netlify deploy preview has been created
    2. add reviewers to PR
    4. set PR status to in review
    5. append `PRdescription` to `LibPRDesc`

7. `∀pr ∈ lib. if reviewPass pr (merge pr) (fix pr)`

8. in library
  1. pull and checkout to `<main>` branch
  2. publish $newLatestVersion to npm from local machine

9. `∀pr ∈ consumer-apps`
  1. `if reviewPass pr`
    1. update `<lib>@$betaVersion` to `<lib>@$newLatestVersion` in app/package.json 
    2. commit and push
    2. merge pr
    3. else `(fix pr)`

10. `∀pr ∈ lib <> consumer-apps >> setAsInQAStatus pr`
11. Send discord message to QA (DM to Elsy, Daniel) with `LibPrLink <> first AppReviewLinks`
12. `∀pr ∈ lib <> consumer-apps. if passQa pr (celebrate) (create new issues and start dev proces over)`
```

## Peer Dependencies

- [Material-UI Versions](https://material-ui.com/versions/)

This package requires @material-ui v4 core, icons, and lab. [Material-UI Installation](https://material-ui.com/getting-started/installation/)

- [Material-UI Styles](https://material-ui.com/styles/basics/)

The CSS Styles implementation uses the updated version and is incompatible with v3.

- [Material-UI Lab](https://material-ui.com/components/about-the-lab/)

A few components use the Lab components such as the Skeleton for the infinite scrolling effect.

[1]: todo include link
[2]: this might could be removed since the management of package versions could
be automated away. None-the-less when the version needs to be updated and what
it needs to be updated to is more complicated than meets the eye.
[3]: TODO: automate the process for fetching current npm version
