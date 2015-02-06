jscs-trailing-whitespace-in-source
==================================

[JSCS](https://github.com/mdevils/node-jscs) plugin to disallow trailing whitespace in source (but not in comments).

Installation
------------

**Using npm:** `npm install --save-dev jscs-trailing-whitespace-in-source`

**Manually:** Download [`rules/jscs-trailing-whitespace-in-source.js`](https://raw.githubusercontent.com/joelrbrandt/jscs-trailing-whitespace-in-source/master/rules/jscs-trailing-whitespace-in-source.js)

Usage
-----

1. Add the path `"node_modules/jscs-trailing-whitespace-in-source/rules/*.js"` to the `additionalRules` property in your JSCS config.
2. Set `disallowTrailingWhitespaceInSource` to `true` in your JSCS config

For example:

```json
{
    "additionalRules": [ "node_modules/jscs-trailing-whitespace-in-source/rules/*.js" ],
    "disallowTrailingWhitespaceInSource": true
}
```

Additionally, if you `requre` this package in node, you'll get an object with a single property named `rulePath` that contains the full path to the rules file.

License
-------

The MIT License (MIT)

Copyright (c) 2014 Ian Wehrman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.