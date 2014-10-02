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

### The user interface (controller) module

### The state (model) module

### The view

`index.html` contains script reference to all style sheets, library scripts, application modules scripts, and the respoke API script.

Markup is divided into several template `<script>` blocks which are read and manipulated by the `ui.js` module. Each template block contains a [Handlebars](http://handlebarsjs.com) template: HTML markup with special Handlebars syntax for injecting data.

A single element, `<div id="ui">` serves as the root HTML element for the application. When the UI module manipulates the page, it attaches rendered templates to this element.

### The respoke API


