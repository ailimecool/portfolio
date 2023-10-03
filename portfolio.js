const express = require("express");
const { engine } = require("express-handlebars");
const port = 2003;
const app = express();

app.engine("handlebars", engine());

app.set("view engine", "handlebars");

app.set("views", "./views");

app.use(express.static(public));

app.listen(port, () => {
  console.log("Server running and listening on port 2003...");
});

const sqlite3 = require("sqlite3");
const db = new new sqlite3.Database("database-portfolio.db")();
