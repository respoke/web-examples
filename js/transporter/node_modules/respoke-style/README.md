# styles for Respoke web properties

This repo has shared styles for Respoke websites.

```bash
# this format tells NPM to use github.com/respoke/style
npm i --save-dev respoke/style
```

## Stylesheet usage

See `SampleGruntfileUsage.js` for building the stylesheet.

Recommended usage is from your own `.scss` stylesheet file:

```scss
@import '../node_modules/respoke-style/styles/base.scss';

/* Now use the styles */

```

## Jade template usage

Inside your local Jade template:

```jade
doctype html
html
    head
        include ../node_modules/respoke-style/head.jade
    body
        include ../node_modules/respoke-style/navbar.jade

        p Some custom paragraph text

        include ../node_modules/respoke-style/footer.jade
```

## Assets

These are files you may want to reuse. You will probably want to copy them during your build. See
the example Gruntfile `copy` task.

`./assets/`
`./assets/images/`
`./assets/js/`

## Exported paths

See the list of exported asset paths in `./index.js`.

You can use these paths as local variables for your SCSS and Jade, or in your build script. See the
example Gruntfile.

## Your project structure

When you copy the `./assets` to your local project, you must serve the `./assets/js/` folder at
the root of your website such that it is at the `/js/` path (required by `./templates/head.jade`).


## Example Gruntfile

See `./SampleGruntfileUsage.js` for an example of building the Respoke styles into one of your projects.
