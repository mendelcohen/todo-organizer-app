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

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "build")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./build/index.html"), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
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
