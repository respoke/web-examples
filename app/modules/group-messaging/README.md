# Group Messaging

## Application Overview

The group messaging demo (/modules/group-messaging) is designed to demonstrate how to use the respoke API to message both individual users and users that are participating in a group chat.

### Logging in

To log in as a user, navigate to `/modules/group-messaging`. Enter a username (or an email address) and submit the form. You will be added to the "Everyone" group automatically and redirected to the main chat screen. You should see a buddy roster with the "Everyone" group listed on the left.

__HINT__: If you use an email address associated to a [gravatar](https://secure.gravatar.com) account, your gravatar will be displayed in the buddy and message lists!

Open another browser (or a private browsing window in your current browser) and repeat this process using a different username (or email address). You should see the "user" from each browser appear in the other browser window's roster. 

![logging in](login.png)

![the buddy roster](buddy-roster.png)

### Chatting with buddies

Click on a buddy in the roster to begin a chat session. A new tab will open at the top of the screen, and you will see a form appear at the bottom where you can enter a message to send to that user. When you send a message to another user it will open a tab in their browser window (if one is not already open) for your conversation.

![chatting with a buddy](buddy-chat.png)

Users may converse with more than one buddy at a time. A chat tab will be created for each conversation. Open another private browsing window (or launch a different browser) and log in as another user to have multiple conversations!

### Chatting in the "Everyone" group

The "Everyone" buddy is special. Sending a message to "Everyone" will open a chat tab for all users connected to the "Everyone" group. Since all users that log into this application are automatically joined to the "Everyone" group, sending a message to the group will open a chat tab in every browser. All users may participate in the "Everyone" chat.

![sending a chat to the Everyone group](everyone-chat-1.png)

![receiving a chat in the Everyone group](everyone-chat-2.png)


## Application Architecture

The group messaging example application follows a simplified model-view-controller (MVC) architecture.

![group messaging application architecture](group-messaging-architecture.png)

### The view

`index.html` contains script reference to all style sheets, library scripts, application modules scripts, and the respoke API script.

Markup is divided into several template `<script>` blocks which are read and manipulated by the `ui.js` module. Each template block contains a [Handlebars](http://handlebarsjs.com) template: HTML markup with special Handlebars syntax for injecting data.

A single element, `<div id="ui">` serves as the root HTML element for the application. When the `ui` module manipulates the page, it attaches rendered templates to this element.

### The ui controller (ui.js)

The `ui` controller manages all interaction with the DOM (view) and renders templates when necessary. It is composed of a number of submodules that each govern specific user interface components:

- `auth`: sets up authentication submodules
    - `authForm`: accepts login credentials
- `groupMessage`: sets up group messaging submodules
    - `menu`: shows and hides elements in responsive mode
    - `tabs`: creates, removes, and pulses tabs during chat
    - `messages`: displays messages for the active chat
    - `buddies`: begins user/group chats
    - `chatForm`: accepts input (messages) for the active chat

Each submodule listens to events from the application's `state` model and manipulates its specific DOM elements accordingly. Likewise, when DOM events occur, each submodule may invoke methods in the `state` model that will perform some operation (sending a message, for example). The `ui` controller does not hold any application data itself; it merely holds references to actual view objects (DOM elements).

All application data belongs to the `state` model. This means that, for example, when a new message arrives for a user, the view is notified and must request message data from the model in order to render the message template.

### The state model (state.js)

The `state` model contains both application logic and application data. It exposes a number of "public" methods which the `ui` controller may invoke, as well as a number of properties that contain data objects such as collections of buddies, messages, and tabs. When the `ui` controller invokes a method on the `state` model, it will typically execute some application logic, manipulate its data, then fire an event to let the controller know that its state has changed. It is also responsible for communicating with the respoke API when required.

### The respoke API

#### Creating a respoke client and connecting to its services

When the `index.html` page is loaded, it instructs the `state` model to initialize itself. (This occurs after all assets, styles, and scripts are loaded.) During initialization the state model creates a respoke `client` object, passing it the respoke application identifier and a flag that indicates that the application is operating in development mode.

```html
<script type="text/javascript">
    (function () {
        App.state.init('7c15ec35-71a9-457f-8b73-97caf4eb43ca');
    }());
</script>
```

```javascript
state.init = function (appId) {
    var connectionOptions = {
        appId: appId,
        developmentMode: true
    };
    state.client = respoke.createClient(connectionOptions);
    //...
};
```

The `state` model maintains a reference to the respoke `client` at all times. It uses this client object to communicate with the respoke services on behalf of the user. Before it can do this, however, the current user must log into the application and connect to respoke with a username (a respoke endpointId). When the user enters their information into the login form and clicks the `submit` button, the `controller` invokes the `login` method on the state model and a respoke connection is established for the `client` object.

```javascript
state.login = function (username) {
    return state.client.connect({
        endpointId: username,
        presence: 'available'
    }).done(function () {
        state.loggedInUser = username;
        state.client.listen('message', onMessageReceived);
        //...
    }, function (err) {
        // handle errors
    });
};
```

When the `client` connection succeeds, the `state` model begins listening to any `message` events raised by the `client` object--incoming messages from other users or from groups of which the current user is a member.

#### Joining the "Everyone" group and populating the buddy list

Once the user has successfully logged in, the controller updates the user interface and instructs the `state` model to populate the buddy list. The `state` model uses the `client` object to join the "Everyone" group, and then retrieves all members from this group to populate the buddy list.

```javascript
state.loadBuddies = function () {
    return state.client.join({id: 'Everyone'}).then(function (group) {
        state.fire('group.joined');
        var buddy = new GroupBuddy(group, false);
        addBuddy(buddy);
        state.everyoneGroup = group;
        state.everyoneGroup.listen('join', onGroupJoin);
        state.everyoneGroup.listen('leave', onGroupLeave);
        return state.everyoneGroup.getMembers().then(function (connections) {
            connections.filter(function (connection) {
                // ignore self
                return connection.endpointId !== state.loggedInUser;
            }).forEach(function (connection) {
                var buddy = new UserBuddy(connection, false);
                addBuddy(buddy);
            });
        }).then(function () {
            //...fire events
            //...handle errors
        });
    }, function (err) {
        //...handle errors
    });
};
```

Once the "Everyone" group has been joined, the `state` model holds a reference to the `group` object returned by the respoke API, assigning this object to the `everyoneGroup` property. It then creates a `GroupBuddy` object which will be added to the `buddies` collection. This allows the `ui` controller to "see" the group as a buddy which will then be rendered in the user interface's buddy list.

The `state` model then listens to the "Everyone" group's `join` and `leave` events which will be triggered when new members become or depart.

It is possible that other users have joined the "Everyone" group already, so the `state` model iterates over the group's members, looking for any that need to be added to the buddy list. It purposely ignores the user who is currently logged in. (Most users don't want to send themselves messages!) 

Once these steps are complete, the `state` model will raise events that tell the `ui` controller to refresh its buddy list so the user can see all available buddies.

#### When members join or leave the "Everyone" group

In the example above, calling `everyoneGroup.getMembers()` created a collection of `respoke.Connection` objects. Connections represent a particular user on a particular device, whether a PC, phone, tablet, etc. Connections that belong to the same endpoint--the same user--have the same `endpointId` property value which identifies a particular user.

When a user joins or leaves a group, the `join` and `leave` events are raised on the group object. Event objects will be passed to any handlers invoked for these events. These handlers are passed a single event argument which holds a reference to the connection from which the event originated. The `state` model tracks buddies by "username" (endpointId), and uses the event object to retrieve that bit of information.

The join handler checks to make sure that the user isn't the currently logged in user, and that the user is not already being tracked in the buddies list. If both of these conditions are met, a new `UserBuddy` object is created for the new member, and it is added to the buddy list. This object will use the connection object to get an instance of the user's endpoint (`connection.getEndpoint()`) in order to track the individual buddy's presence (more on this later). The `state` model then fires an event and the `ui` controller updates the view with the altered buddies list. 

```javascript
function onGroupJoin(e) {
    var username = e.connection.endpointId;

    // don't join self
    if (username === state.loggedInUser) {
        return;
    }

    var buddy = findBuddy(username);

    if (buddy) {
        // already tracking this endpoint
        return;
    }

    buddy = new UserBuddy(e.connection, false);
    addBuddy(buddy);

    state.fire('buddies.updated');
}
```

The leave handler is a bit more simplistic. It simply captures the `endpointId` from the event object created by the group, then attempts to remove a matching buddy from the buddies collection. If the removal succeeds, an event is fired and the `ui` controller updates the view.

```javascript
function onGroupLeave(e) {
    var username = e.connection.endpointId;
    if (removeBuddy(username)) {
        state.fire('buddies.updated');
        closeTab(username);
    }
}
```

#### When a buddy changes presence

The `UserBuddy` constructor is used to store a reference to a buddy's endpoint, track that buddy's presence changes, and send messages (by way of the client) to that buddy (more on that later).

```javascript
function Buddy(entity, isActive) {
    var buddy = {
        username: entity.id,
        presence: entity.presence || 'available'
        //...other properties
    };

    return respoke.EventEmitter(buddy);
}

function UserBuddy(connection, isActive) {
    var endpoint = connection.getEndpoint();
    var inst = new Buddy(endpoint, isActive);
    
    inst.dispose = function () {
        endpoint.ignore('presence', onPresenceChange);
        endpoint = null;
    };

    function onPresenceChange(e) {
        inst.presence = e.presence;
        inst.fire('presence.changed');
    }
    endpoint.listen('presence', onPresenceChange);
    
    //...other methods

    return inst;
}
```

When a `UserBuddy` object is created, it sets up an event handler that listens for the `presence` event on the respoke endpoint. When this event fires the user object updates its own internal presence data, then fires its *own* `presence.changed` event. When the `state` model adds a user buddy to its buddies list, it listens for this event to know that a buddy's presence has changed, and in turn notifies the `ui` controller to refresh its buddy list (thereby showing the updated presence value). When a buddy is removed from the `state` model's buddy list, its dispose method is called and the presence event handler is removed from the endpoint object. The `state` model will also stop listening to the buddy object as well.


#### When the client sends a message

Buddy objects do more than track state: they are also responsible for routing messages to the appropriate places. In the code below, a `sendMessage` method is added to each type of buddy object. In the case of users, the message is sent to the endpoint object; in the case of groups (the "Everyone" group), to the group object.

```javascript
function Buddy(entity, isActive) {
    //...data properties
}

function UserBuddy(connection, isActive) {
    var endpoint = connection.getEndpoint();
    var inst = new Buddy(endpoint, isActive);

    //...other methods

    inst.sendMessage = function (content) {
        return endpiont.sendMessage({
            message: content
        });
    };

    return inst;
}

function GroupBuddy(group, isActive) {
    var inst = new Buddy(group, isActive);

    inst.sendMessage = function (content) {
        return group.sendMessage({
            message: content
        });
    };

    return inst;
}
```

At this point you might be asking: why introduce these levels of indirection between buddy objects and endpoints/groups? Why doesn't the `state` model listen to endpoints/groups directly? By encapsulating an endpoint behind a custom type (e.g., `UserBuddy`) application-specific functionality can be added to a buddy object without altering an endpoint directly, or introducing additional code into the `state` model itself.

Consider a use case in which a specific message has some side-effect for a particular user:

```javascript
function UserBuddy(connection, isActive) {
    //...
    inst.displayName = inst.username; //Anikan

    inst.sendMessage = function (content) {
        // set a new nickname?
        // content = "/nick (nickname)"
        var match = content.match(/^\/nick\s([a-z]+)$/i);
        if (match) {
            inst.displayName = match[1];
            content = '> You are now known as ' + inst.displayName;
        }
        return endpiont.sendMessage({
            message: content
        });
    };
    
    //...
}
```

In this example, if Luke sends his buddy Anikan the message: `/nick Vader`, the buddy will see the message: `> You are now known as Vader`. If the view's buddy list template uses the `displayName` property instead of `username`, Luke will see Anikan represented as "Vader". By encapsulating the endpoint behind a buddy object it is possible to cleanly introduce additional application logic before actually interacting with the endpoint. 

#### When the client receives a message



#### When the client logs out