const express = require("express");
const { engine } = require("express-handlebars");
const port = 2003;
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connectSqlite3 = require("connect-sqlite3");
const cookieParser = require("cookie-parser");

app.engine("handlebars", engine());

app.set("view engine", "handlebars");

app.set("views", "./views");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const SQLiteStore = connectSqlite3(session);

app.use(
  session({
    store: new SQLiteStore({ db: "session-db.db" }),
    saveUninitialized: false,
    resave: false,
    secret: "ThisIsMySecretPasswordWebDev",
  })
);

app.get("/", function (req, res) {
  console.log("SESSION: ", req.session);
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin,
  };
  res.render("home.handlebars", model);
});

app.get("/work-page", function (req, res) {
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin,
  };
  res.render("work-page.handlebars", model);
});

app.get("/projects", function (req, res) {
  db.all("SELECT * FROM projects", function (error, theProjects) {
    if (error) {
      const model = {
        dbError: true,
        theError: error,
        projects: [],

        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      };

      res.render("work-page.handlebars", model);
    } else {
      const model = {
        dbError: false,
        theError: "",
        projects: theProjects,

        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      };

      res.render("work-page.handlebars", model);
    }
  });
});

app.get("/projects/delete/:id", (req, res) => {
  const id = req.params.id;
  if (req.session.isLoggedIn === true && req.session.isAdmin === true) {
    db.run(
      "DELETE FROM projects WHERE projectid=?",
      [id],
      function (error, theProjects) {
        if (error) {
          const model = {
            dbError: true,
            theError: error,
            isLoggedIn: req.session.isLoggedIn,
            name: req.session.name,
            isAdmin: req.session.isAdmin,
          };

          res.render("home.handlebars", model);
        } else {
          const model = {
            dbError: false,
            theError: "",
            isLoggedIn: req.session.isLoggedIn,
            name: req.session.name,
            isAdmin: req.session.isAdmin,
          };

          res.render("home.handlebars", model);
        }
      }
    );
  } else {
    res.redirect("/login");
  }
});

app.get("/projects/new", (req, re) => {
  if (req.session.isLoggedIn === true && rq.session.isAdmin === true) {
    const model = {
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin,
    };

    res.render("new-project.handlebars", model);
  } else {
    res.redirect("/login");
  }
});

app.post("/projects/new", (req, res) => {
  const newproject = [
    req.body.projectimg,
    req.body.projectname,
    req.body.projectdesription,
    req.body.projectdate,
  ];
  if (req.session.isLoggedIn === true && req.session.isAdmin === true) {
    db.run(
      "INSERT INTO projects (projectimg, projectname, projectdesription, projectdate) VALUES (?,?,?,?)",
      newproject,
      (error) => {
        if (error) {
          console.log("ERROR: ", error);
        } else {
          console.log("Line added into the projects table!");
        }

        res.render("/projects");
      }
    );
  } else {
    res.redirect("/login");
  }
});

app.get("/project-page", function (req, res) {
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin,
  };
  res.render("project-page.handlebars", model);
});

app.get("/about-me", function (req, res) {
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin,
  };
  res.render("about-me.handlebars", model);
});

app.get("/contact", function (req, res) {
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin,
  };
  res.render("contact.handlebars", model);
});

app.get("/login", function (req, res) {
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin,
  };
  res.render("login.handlebars", model);
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log("LOGIN: ", username);
  console.log("PASSWORD: ", password);

  if (username === "emilia.fredriksson" && password === "WebDev") {
    console.log("Emilia is logger in!");
    req.session.isAdmin = true;
    req.session.isLoggedIn = true;
    req.session.name = "Emilia";
    res.redirect("/");
  } else {
    console.log("Wrong user and/or password!");
    req.session.isAdmin = false;
    req.session.isLoggedIn = false;
    req.session.name = "";
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    console.log("Error while destroying the session: ", err);
  });
  console.log("Logged out...");
  res.redirect("/");
});

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("database-portfolio.db");

db.run(
  "CREATE TABLE user(userid INTEGER PRiMARY KEY, userusername TEXT NOT NULL, userpassword TEXT NOT NULL, useremail TEXT NOT NULL)",
  (error) => {
    if (error) {
      console.log("ERROR", error);
    } else {
      console.log("---> Table user created!");

      const user = [
        {
          id: "1",
          username: "emilia.fredriksson",
          password: "WebDev",
          email: "frem22pu@student.ju.se",
        },
      ];

      user.forEach((oneUser) => {
        db.run(
          "INSERT INTO user(userid, userusername, userpassword, useremail) values (?,?,?,?)",
          [oneUser.id, oneUser.username, oneUser.password, oneUser.email],
          (error) => {
            if (error) {
              console.log("ERROR", error);
            } else {
              console.log("Line added into user tabel!");
            }
          }
        );
      });
    }
  }
);

db.run(
  "CREATE TABLE messages(messageid INTEGER PRIMARY KEY, messagename TEXT NOT NULL, messagesurname TEXT NOT NULL, messageemail TEXT NOT NULL, messagemessage TEXT NOT NULL, messagedate TEXT NOT NULL)",
  (error) => {
    if (error) {
      console.log("ERROR", error);
    } else {
      console.log("---> Table messages created!");

      const messages = [];

      messages.forEach((oneMessage) => {
        db.run(
          "INSERT INTO messages(messageid, messagename, messagesurname, messageemail, messagemessage, messagedate) values (?,?,?,?,?,?)",
          [
            oneMessage.id,
            oneMessage.name,
            oneMessage.surname,
            oneMessage.email,
            oneMessage.message,
            oneMessage.date,
          ],
          (error) => {
            if (error) {
              console.log("ERROR", error);
            } else {
              console.log("Line added into message tabel!");
            }
          }
        );
      });
    }
  }
);

db.run(
  "CREATE TABLE projects (projectid INTEGER PRIMARY KEY, projectimg TEXT NOT NULL, projectname TEXT NOT NULL, projectdescription TEXT NOT NULL, projectdate REAL NOT NULL)",
  (error) => {
    if (error) {
      console.log("ERROR", error);
    } else {
      console.log("---> Table projects created!");

      const projects = [
        {
          id: "1",
          img: "/img/stylization-minnie-mouse.jpg",
          name: "Stylization Minnie Mouse",
          description:
            "This was a school assignment my first year on the New Media Design program. We were supposed to make a stylization of whatever we wanted, with the help of illustrator. I choose to do Minnie Mouse bow because it is something that reminded me of my childhood and that I thought that I was able to do in the timeframe.",
          date: "2022-10-03",
        },
        //   ask on lab why they change from "" to blue
        { id: "2", img: "", name: "", description: "", date: "" },
        { id: "3", img: "", name: "", description: "", date: "" },
        { id: "4", img: "", name: "", description: "", date: "" },
        { id: "5", img: "", name: "", description: "", date: "" },
      ];

      projects.forEach((oneProject) => {
        db.run(
          "INSERT INTO projects(projectid, projectimg, projectname, projectdescription, projectdate) values (?,?,?,?,?)",
          [
            oneProject.id,
            oneProject.img,
            oneProject.name,
            oneProject.description,
            oneProject.date,
          ],
          (error) => {
            if (error) {
              console.log("ERROR", error);
            } else {
              console.log("Line added into project tabel!");
            }
          }
        );
      });
    }
  }
);

db.run(
  "CREATE TABLE projectTag (projecttagid INTEGER PRIMARY KEY, projectid INTEGER, tagid INTEGER, FOREIGN KEY (projectid) REFERENCES projects, FOREIGN KEY (tagid) REFERENCES tag",
  (error) => {
    if (error) {
      console.log("ERROR", error);
    } else {
      console.log("---> Table projectTag created!");

      const projectTag = [];

      projectTag.forEach((oneProjectTag) => {
        db.run(
          "INSERT INTO projectTag(projecttagid, projectid, tagid) values (?,?, ?)",
          [oneProjectTag.id, oneProjectTag.projectid, oneProjectTag.tagid],
          (error) => {
            if (error) {
              console.log("ERROR", error);
            } else {
              console.log("Line added into projectTag tabel!");
            }
          }
        );
      });
    }
  }
);

db.run(
  "CREATE TABLE tag (tagid INTEGER PRIMARY KEY, tagtagname TEXT NOT NULL",
  (error) => {
    if (error) {
      console.log("ERROR", error);
    } else {
      console.log("---> Table tag created!");

      const tag = [
        { id: "1", tagname: "HTML" },
        { id: "2", tagname: "CSS" },
        { id: "3", tagname: "JavaScript" },
        { id: "4", tagname: "Photoshop" },
        { id: "5", tagname: "Illustrator" },
        { id: "6", tagname: "InDesign" },
        { id: "7", tagname: "Figma" },
      ];

      tag.forEach((oneTag) => {
        db.run(
          "INSERT INTO tag(tagid, tagtaganem) values (?,?)",
          [oneTag.id, oneTag.tagname],
          (error) => {
            if (error) {
              console.log("ERROR", error);
            } else {
              console.log("Line added into tag tabel!");
            }
          }
        );
      });
    }
  }
);

app.listen(port, () => {
  console.log("Server running and listening on port 2003...");
});
