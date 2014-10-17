# Digium Respoke Example Apps

These are a suite of example applications to show how to work with the
[Respoke](https://docs.respoke.io/) API just using jQuery.

### Getting Started

You can run the `app` directory from the server of your choice, but if you want
to be able to run the tests and build the JavaScript and CSS you will need to
install Node.js, npm, the node modules, and the bower dependencies. To install
the dependencies, just run this:

```bash
npm install; bower install;
```

### Development

To build the CSS and JavaScript, start a server and continuously run tests,
simply kick off the grunt server by running this:

```bash
grunt server
```

Once the server kicks off, you can see all of the apps by visiting
`http://localhost:9876`


### Group Messaging

For more details on how to setup and use the group messaging example please see
the [README](app/modules/group-messaging/README.md) in that module.
