# Todo Organizer App

More than just a means to post all your todos and check them off, Todo Organizer App provides four categories to characterize your todos based on the four quadrants of time management.

## Run Locally

1. Using the command line git clone the repo in a local directory:

```
git clone https://github.com/mendelcohen/todo-organizer-app.git
```

2. Create a Postgres database with these tables and fields:

```
Table: users, Fields: username, password, created_At, updated_at
Table: todos, Fields: title, description, user_id, start_date, start_time, end_date, end_time, category, created_At, updated_at
```

3. Create a .env file in the repo and set these five database variables: USER, HOST, DATABASE, PASSWORD, PORT.

4. Make sure port 3001 is available or change the port in index.js line 2 to whichever port you would like to use. Then, in the terminal:

```
npm run server
```

## Roadmap

- Install a JavaScript calendar library in the view todo page for users to see their scheduled todos in a calendar format.
