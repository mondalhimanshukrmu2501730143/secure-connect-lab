# Secure Connect and Communication Platform (Lab 4)

A secure server-side application built with Node.js and Express.js implementing core backend security practices, stateless authentication, role-based resource protection, and real-time bidirectional messaging.

---

## Features

- **User Authentication**: Secure user registration and login with salt-hashed passwords using `bcryptjs`.
- **JWT Authorization**: Stateless session handling and protected endpoints verified via `jsonwebtoken`.
- **Protected Notes API**: Scoped CRUD operations allowing authenticated users to manage their own notes.
- **Real-Time Communication**: WebSocket/Socket.IO server supporting room-based messaging with broadcast mechanics.
- **Event-Driven Architecture**: Native Node.js `EventEmitter` decoupled listener patterns for internal system logging.
- **Config Management**: Secure environment variable loading via `dotenv`.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Security**: `bcryptjs`, `jsonwebtoken`
- **Real-Time Engine**: Socket.IO
- **Environment**: `dotenv`

---

## Project Structure

```text
secure-connect-lab/
├── .env
├── .gitignore
├── README.md
├── package.json
├── server.js
├── eventEmitter.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   └── notes.js
└── public/
    └── index.html
