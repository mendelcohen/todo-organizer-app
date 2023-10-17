const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const path = require("path");

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "./public")));

// Handle GET requests to /api route
app.get("/index", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public", "index.html"));
});

const auth = require("./auth");

const queries = require("./queries");
const {
  createSession,
  getTodos,
  createUser,
  createTodo,
  getTodo,
  editTodo,
  editCompleteTodo,
  deleteTodo,
} = queries;

app.get("/test", auth, (req, res) => {
  console.log(req);
  res.json({ message: "Hello from the server!" });
});

app.post("/session/create", createSession);

app.get("/todos/all/:userId", getTodos);

app.post("/user/create", createUser);

app.post("/todo/create", createTodo);

app.get("/todo/:id", getTodo);

app.put("/todo/edit/:id", editTodo);

app.put("/todo/edit-complete/:id", editCompleteTodo);

app.delete("/todo/delete/:id", deleteTodo);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
