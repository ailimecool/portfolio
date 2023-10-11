const express = require("express");
const { engine } = require("express-handlebars");
const port = 2003;
const app = express();
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const session = require("express-session");
const connectSqlite3 = require("connect-sqlite3");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

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

// Homepage
app.get("/", function (req, res) {
  console.log("SESSION: ", req.session);

  // saltRounds = 12;
  // bcrypt.hash("WebDev", saltRounds, (err, hash) => {
  //   if (err) {
  //     console.log("Error encrypting the password: ", err);
  //   } else {
  //     console.log("Hashed password(GENERATE only ONCE): ", hash);
  //   }
  // });

  // saltRounds = 12;
  // bcrypt.hash("WebDevJerome", saltRounds, (err, hash) => {
  //   if (err) {
  //     console.log("Error encrypting the password: ", err);
  //   } else {
  //     console.log("Hashed password(GENERATE only ONCE): ", hash);
  //   }
  // });

  // saltRounds = 12;
  // bcrypt.hash("WebDevJasmin", saltRounds, (err, hash) => {
  //   if (err) {
  //     console.log("Error encrypting the password: ", err);
  //   } else {
  //     console.log("Hashed password(GENERATE only ONCE): ", hash);
  //   }
  // });

  // saltRounds = 12;
  // bcrypt.hash("WebDevLinus", saltRounds, (err, hash) => {
  //   if (err) {
  //     console.log("Error encrypting the password: ", err);
  //   } else {
  //     console.log("Hashed password(GENERATE only ONCE): ", hash);
  //   }
  // });

  // saltRounds = 12;
  // bcrypt.hash("WebDevMira", saltRounds, (err, hash) => {
  //   if (err) {
  //     console.log("Error encrypting the password: ", err);
  //   } else {
  //     console.log("Hashed password(GENERATE only ONCE): ", hash);
  //   }
  // });

  // saltRounds = 12;
  // bcrypt.hash("WebDevSusanne", saltRounds, (err, hash) => {
  //   if (err) {
  //     console.log("Error encrypting the password: ", err);
  //   } else {
  //     console.log("Hashed password(GENERATE only ONCE): ", hash);
  //   }
  // });

  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin,
  };
  res.render("home.handlebars", model);
});

// Project page
app.get("/project", function (req, res) {
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin,
  };
  res.render("projects.handlebars", model);
});

// Displaying projects from database
app.get("/projects", (req, res) => {
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

      res.render("projects.handlebars", model);
    } else {
      const model = {
        dbError: false,
        theError: "",
        projects: theProjects,

        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      };

      res.render("projects.handlebars", model);
    }
  });
});

// Delete a project
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

          res.render("projects.handlebars", model);
        } else {
          console.log("Project deleted!");
          const model = {
            dbError: false,
            theError: "",
            isLoggedIn: req.session.isLoggedIn,
            name: req.session.name,
            isAdmin: req.session.isAdmin,
          };

          res.render("projects.handlebars", model);
        }
      }
    );
  } else {
    res.redirect("/login");
  }
});

// Create a new project
app.get("/projects/new", (req, res) => {
  if (req.session.isLoggedIn === true && req.session.isAdmin === true) {
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
    req.body.projectdescription,
    req.body.projectdate,
  ];
  if (req.session.isLoggedIn === true && req.session.isAdmin === true) {
    db.run(
      "INSERT INTO projects (projectimg, projectname, projectdescription, projectdate) VALUES (?,?,?,?)",
      newproject,
      (error) => {
        if (error) {
          console.log("ERROR: ", error);
        } else {
          console.log("Line added into the projects table!");
        }

        res.redirect("/projects");
      }
    );
  } else {
    res.redirect("/login");
  }
});

// Update an existing project
app.get("/projects/update/:id", (req, res) => {
  const id = req.params.id;
  db.get(
    "SELECT * FROM projects WHERE projectid=?",
    [id],
    function (error, theProject) {
      if (error) {
        console.log("ERROR", error);
        const model = {
          dbError: true,
          theError: error,
          project: {},
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        };

        res.render("modifyproject.handlebars", model);
      } else {
        const model = {
          dbError: false,
          theError: "",
          project: theProject,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        };

        res.render("modifyproject.handlebars", model);
      }
    }
  );
});

app.post("/projects/update/:id", (req, res) => {
  const id = req.params.id;
  const updateproject = [
    req.body.projectimg,
    req.body.projectname,
    req.body.projectdescription,
    req.body.projectdate,
    id,
  ];
  if (req.session.isLoggedIn === true && req.session.isAdmin === true) {
    db.run(
      "UPDATE projects SET projectimg=?, projectname=?, projectdescription=?, projectdate=? WHERE projectid=?",
      updateproject,
      (error) => {
        if (error) {
          console.log("ERROR", error);
        } else {
          console.log("Project updated!");
        }
        res.redirect("/projects");
      }
    );
  } else {
    res.redirect("/login");
  }
});

// Eventually seperate project pages
// app.get("/project-page", function (req, res) {
//   const model = {
//     isLoggedIn: req.session.isLoggedIn,
//     name: req.session.name,
//     isAdmin: req.session.isAdmin,
//   };
//   res.render("project-page.handlebars", model);
// });

// About page
app.get("/about-me", function (req, res) {
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin,
  };
  res.render("about-me.handlebars", model);
});

// Contact page
app.get("/contact", function (req, res) {
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin,
  };
  res.render("contact.handlebars", model);
});

// Send messages
app.get("/messages/new", (req, res) => {
  res.render("contact.handlebars");
});

app.post("/messages/new", (req, res) => {
  const newmessage = [
    req.body.messagename,
    req.body.messagesurname,
    req.body.message,
    req.body.messageemail,
    req.body.messagedate,
  ];
  db.run(
    "INSERT INTO messages (messagename, messagesurname, message, messageemail, messagedate) VALUES (?,?,?,?,?)",
    newmessage,
    (error) => {
      if (error) {
        console.log("ERROR: ", error);
      } else {
        console.log("Line added into the messages table!");
      }

      res.redirect("/contact");
    }
  );
});

// Messages page
app.get("/message", (req, res) => {
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin,
  };
  res.render("messages.handlebars", model);
});

// Display messages
app.get("/messages", (req, res) => {
  db.all("SELECT * FROM messages", function (error, theMessages) {
    if (error) {
      const model = {
        dbError: true,
        theError: error,
        messages: [],

        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      };

      res.render("messages.handlebars", model);
    } else {
      console.log(theMessages);
      const model = {
        dbError: false,
        theError: "",
        messages: theMessages,

        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      };

      res.render("messages.handlebars", model);
    }
  });
});

// Dlete messages
app.get("/messages/delete/:id", (req, res) => {
  const id = req.params.id;
  if (req.session.isLoggedIn === true && req.session.isAdmin === true) {
    db.run(
      "DELETE FROM messages WHERE messageid=?",
      [id],
      function (error, theMessages) {
        if (error) {
          const model = {
            dbError: true,
            theError: error,
            isLoggedIn: req.session.isLoggedIn,
            name: req.session.name,
            isAdmin: req.session.isAdmin,
          };

          res.render("messages.handlebars", model);
        } else {
          console.log("Message deleted!");
          const model = {
            dbError: false,
            theError: "",
            isLoggedIn: req.session.isLoggedIn,
            name: req.session.name,
            isAdmin: req.session.isAdmin,
          };

          res.render("messages.handlebars", model);
        }
      }
    );
  }
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

            res.render("projects.handlebars", model);
          } else {
            console.log("Project deleted!");
            const model = {
              dbError: false,
              theError: "",
              isLoggedIn: req.session.isLoggedIn,
              name: req.session.name,
              isAdmin: req.session.isAdmin,
            };

            res.render("projects.handlebars", model);
          }
        }
      );
    } else {
      res.redirect("/login");
    }
  });
});

// Login function
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
    console.log("Emilia is logged in!");
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

// Logout funciton
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    console.log("Error while destroying the session: ", err);
  });
  console.log("Logged out...");
  res.redirect("/");
});

// Database created
const db = new sqlite3.Database("database-portfolio.db");

db.run(
  "CREATE TABLE user(userid INTEGER PRIMARY KEY AUTOINCREMENT, userusername TEXT NOT NULL, userpassword TEXT NOT NULL, useremail TEXT NOT NULL)",
  (error) => {
    if (error) {
      console.log("ERROR ", error);
    } else {
      console.log("---> Table user created!");

      const user = [
        {
          id: "1",
          username: "emilia.fredriksson",
          password:
            "$2b$12$x7XpmXSjhT9k.QEDP6YdnedBOJLKamZatY.hY6Ol4Vk0mkVvSYXQW",
          email: "frem22pu@student.ju.se",
        },
        {
          id: "2",
          username: "jerome.landre",
          password:
            "$2b$12$ABmpbbk2Mi8S6f9wKFUq9.N.gJQkX6w50yfcSYs0tkW.lFB07TvYq",
          email: "jerome.landre@ju.se",
        },
        {
          id: "3",
          username: "jasmin.jakupovic",
          password:
            "$2b$12$mRFYNF59wDho4vvMOmcJ8eKpw0xcv6RLFc3XV4E8sEwiQWBhy7tFy",
          email: "jasmin.jakupovic@ju.se",
        },
        {
          id: "4",
          username: "linus.rudbeck",
          password:
            "$2b$12$IdzTKCif2QgfKa0YRm5k0OGZDy5iZ7.wfHS5O5/0pEjsyevT4Xsr6",
          email: "linus.rudbeck@ju.se",
        },
        {
          id: "5",
          username: "mira.pop",
          password:
            "$2b$12$sZ.59rcSBk5QczPAFluOGeX/n6snhJOocaCkiJGIHk25T62MmjCsi",
          email: "mira.pop@ju.se",
        },
        {
          id: "6",
          username: "susanne.smithberger",
          password:
            "$2b$12$0qcGzOeUC3X5nDHFx5Vjf.5sMsuoglfrVbV5Hzo4rentT.FLPGFBS",
          email: "susanne.smithberger@ju.se",
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
  "CREATE TABLE messages(messageid INTEGER PRIMARY KEY AUTOINCREMENT, messagename TEXT NOT NULL, messagesurname TEXT NOT NULL, messageemail TEXT NOT NULL, message TEXT NOT NULL, messagedate TEXT NOT NULL)",
  (error) => {
    if (error) {
      console.log("ERROR", error);
    } else {
      console.log("---> Table messages created!");

      const messages = [];

      messages.forEach((oneMessage) => {
        db.run(
          "INSERT INTO messages(messageid, messagename, messagesurname, messageemail, message, messagedate) values (?,?,?,?,?,?)",
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
              console.log("Line added into messages tabel!");
            }
          }
        );
      });
    }
  }
);

db.run(
  "CREATE TABLE projects (projectid INTEGER PRIMARY KEY AUTOINCREMENT, projectimg TEXT NOT NULL, projectname TEXT NOT NULL, projectdescription TEXT NOT NULL, projectdate REAL NOT NULL)",
  (error) => {
    if (error) {
      console.log("ERROR", error);
    } else {
      console.log("---> Table projects created!");

      const projects = [];

      projects.forEach((oneProject) => {
        db.run(
          "INSERT INTO projects (projectid, projectimg, projectname, projectdescription, projectdate) values (?,?,?,?,?)",
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

// Server up and running
app.listen(port, () => {
  console.log("Server running and listening on port 2003...");
});
