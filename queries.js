const { Pool } = require("pg");
require("dotenv").config();
const { USER, HOST, DATABASE, PASSWORD, PORT } = process.env;
let pool;
if (process.env.NODE_ENV !== "production") {
  pool = new Pool({
    user: USER,
    host: HOST,
    database: DATABASE,
    password: PASSWORD,
    port: PORT,
  });
  pool.connect(function (err) {
    if (err) {
      throw err;
    }
    console.log("Connected!");
  });
} else {
  console.log(process.env.POSTGRESQL_EXTERNAL_URL);
  pool = new Pool({
    connectionString: process.env.POSTGRESQL_EXTERNAL_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  pool.connect();
}

var jwt = require("jsonwebtoken");

function createSession(request, response) {
  const username = request.body.username;
  const password = request.body.password;

  pool.query(
    "SELECT * FROM users WHERE username = $1 AND password = $2",
    [username, password],
    (error, results) => {
      if (error) {
        console.log("error");
        return response.status(500).json(error);
      }
      if (results.rows.length) {
        const user = results.rows[0];
        var token = jwt.sign({ user_id: user.id }, "secret");
        return response.status(200).json({ user: user.id, token });
      } else {
        return response.status(401).json("Unauthorized");
      }
    }
  );
}

function createUser(request, response) {
  const { username, password } = request.body;
  pool.query("SELECT password FROM users", (error, results) => {
    if (error) {
      throw error;
    }
    const passwords = results.rows.map((row) => row.password);
    for (let i = 0; i < passwords.length; i++) {
      if (passwords[i] === password) {
        return response
          .status(422)
          .send({ message: `Password "${password}" unavailable` });
      }
    }
    pool.query(
      "INSERT INTO users (username, password) values ($1, $2) RETURNING username",
      [username, password],
      (error, results) => {
        if (error) {
          throw error;
        }
        return response
          .status(201)
          .send({ message: `Welcome ${results.rows[0].username}` });
      }
    );
  });
}

function getTodos(request, response) {
  const id = parseInt(request.body.id);
  pool.query(
    `SELECT * FROM todos WHERE user_id = ${id} AND is_completed = false ORDER BY id ASC`,
    (error, results) => {
      if (error) {
        throw error;
      }
      const todos = results.rows;
      let groupedTodos = {};
      for (let i = 0; i < todos.length; i++) {
        groupedTodos[todos[i].category]
          ? groupedTodos[todos[i].category].push(todos[i])
          : (groupedTodos[todos[i].category] = [todos[i]]);
      }
      return response.status(200).json(groupedTodos);
    }
  );
}

function createTodo(request, response) {
  const { title, description, user_id, start_date, end_date, category } =
    request.body;
  pool.query(
    "INSERT INTO todos (title, description, user_id, start_date, end_date, category) values ($1, $2, $3, $4, $5, $6) RETURNING id, title, description, user_id, start_date, end_date, category",
    [title, description, user_id, start_date, end_date, category],
    (error, results) => {
      if (error) {
        throw error;
      }
      const todo = results.rows[0];
      return response.status(200).json({
        message: `Your todo ${title} has been added`,
        todo: todo,
      });
    }
  );
}

function getTodo(request, response) {
  const id = parseInt(request.body.id);
  pool.query(`SELECT * FROM todos WHERE id = ${id}`, (error, results) => {
    if (error) {
      throw error;
    }
    const [todo] = results.rows;
    return response.status(200).json(todo);
  });
}

function editTodo(request, response) {
  const { title, description, category, start_date, end_date, id } =
    request.body;
  pool.query(
    "UPDATE todos SET title = $1, description = $2, category = $3, start_date = $4, end_date = $5 WHERE id = $6 RETURNING title, description, category, start_date, end_date, id, user_id",
    [title, description, category, start_date, end_date, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      return response.status(200).json({
        message: `Your todo ${title} has been updated`,
        todo: {
          title,
          description,
          category,
          start_date,
          end_date,
          id,
        },
      });
    }
  );
}

function editCompleteTodo(request, response) {
  const id = parseInt(request.body.id);
  pool.query(
    `UPDATE todos SET is_completed = NOT is_completed WHERE id = $1 returning is_completed`,
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const result = results.rows[0];
      return response.status(200).json({
        message: "Your todo has been updated",
        update: result,
      });
    }
  );
}

function deleteTodo(request, response) {
  const id = parseInt(request.body.id);
  pool.query("DELETE FROM todos WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    return response
      .status(200)
      .send({ message: `Todo deleted with ID: ${id}` });
  });
}

module.exports = {
  createSession,
  createUser,
  getTodos,
  createTodo,
  getTodo,
  editTodo,
  editCompleteTodo,
  deleteTodo,
};
