# Digium Respoke Example Apps

These are a suite of example applications to show how to work with the
[Respoke](https://docs.respoke.io/) API just using jQuery.


### Getting Started

The fastest way to try out the web-examples is to [view them live][examples]!

[examples]: https://respoke.github.com/web-examples "view examples"

Alternatively you can run the already built files from the web server of your
choice as they are static HTML files. Point your web server to the `app`
directory or copy the files there to an already publicly accessible location.

See the Development section for details on how to use Node.js to run the
examples.

### Group Messaging

For more details on how to setup and use the group messaging example please see
the [README](app/modules/group-messaging/README.md) in that module.

### Development

You will need to install [Node.js](http://nodejs.org),
[npm](https://www.npmjs.org), and [Bower](http://bower.io) to build the
JavaScript and CSS. After installing npm and Bower, install the dependencies.

```bash
npm install; bower install;
```

To build the JavaScript, CSS, and HTML:

```bash
grunt build
```

To run the built-in Node.js server with file watching and a test runner:

```bash
grunt server
```

Once the server starts, you can see all of the apps by visiting
`http://localhost:9876`.

If you have push access to the respoke/web-examples repo you can update the
[live examples][examples] with:

```bash
grunt publish
```

### Testing

The tests are written using [mocha](http://mochajs.org). After going through the
setup in the Development section, just run the grunt test task. This will build
the necessary files and run the [jshint](http://jshint.com/docs/) linter and mocha.

```bash
grunt test
```

### License

The code in this package uses the MIT license.

> Copyright (c) 2014, Digium, Inc.
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
> THE SOFTWARE.
