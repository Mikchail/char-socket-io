const express = require("express");
const path = require("path");
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const session = require("express-session");

let messages = [];

// Use the session middleware
const sessionMiddleware = session({
  secret: "keyboard cat",
  cookie: {maxAge: 620000},
});
app.use(sessionMiddleware);
let idCounter = 0;

app.use((req, res, next) => {
  if (!req.session.userId) {
    req.session.userId = idCounter++;
    req.session.userName = `User${req.session.userId}`;
    req.session.first = true;
    req.session.save();
  }

  next();
});
app.use(express.static(path.join(__dirname, "../front")));
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});
io.on("connection", (socket) => {
  const {session} = socket.request;
  if (messages.length) {
    for (const message of messages) {
      socket.emit("message", message);
    }
  }

  if (session.first) {
    socket.emit("message", {
      user: "SERVER",
      date: Date.now(),
      content: `Добро пожаловать в чат, ${session.userName}!`,
    });

    session.first = false;
    session.save();
  } else {
    socket.emit("message", {
      user: "SERVER",
      date: Date.now(),
      content: `Как же хорошо, что вы, ${session.userName}, к нам вернулись!`,
    });
  }

  socket.on("message", (content) => {
		console.log(session.userName)
    const message = {
      user: session.userName,
      date: Date.now(),
      content,
    };

    io.emit("message", message);

    messages.push(message);

    if (messages.length > 15) {
      messages = messages.slice(-15);
    }
  });

  socket.on("setname", (name) => {
    session.userName = name;
    session.save();
  });

  console.log("a user connected");
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
