const express = require("express");
const { engine } = require("express-handlebars");
const port = 2003;
const app = express();

app.engine("handlebars", engine());

app.set("view engine", "handlebars");

app.set("views", "./views");

app.use(express.static("public"));

app.get("/public/css/my-styles.css", (req, res) => {
  res.render("/public/css/my-styles.css");
});

app.get("/", function (req, res) {
  res.render("home.handlebars");
});

app.get("/work-page", function (req, res) {
  res.render("work-page.handlebars");
});

app.get("/project-page", function (req, res) {
  res.render("project-page.handlebars");
});

app.get("/about-me", function (req, res) {
  res.render("about-me.handlebars");
});

app.get("/contact", function (req, res) {
  res.render("contact.handlebars");
});

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("database-portfolio.db")();

app.listen(port, () => {
  console.log("Server running and listening on port 2003...");
});
