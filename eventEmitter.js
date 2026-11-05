// eventEmitter.js
const EventEmitter = require('events');

class AppEmitter extends EventEmitter {}

const appEmitter = new AppEmitter();

// Listen to internal system events
appEmitter.on('user:registered', (userData) => {
  console.log(`[Event: user:registered] User created: ${userData.username} (${userData.email})`);
});

appEmitter.on('note:created', (note) => {
  console.log(`[Event: note:created] Note "${note.title}" created by ${note.owner}`);
});

module.exports = appEmitter;