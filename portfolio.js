const express = require("express");
const { engine } = require("express-handlebars");
const port = 2003;
const app = express();

app.engine("handlebars", engine());

app.set("view engine", "handlebars");

app.set("views", "./views");

app.use(express.static("public"));

// app.get("/public/css/my-styles.css", (req, res) => {
//   res.render("public/css/my-styles.css");
// });
// How do I do this?

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

app.get("/login", function (req, res) {
  res.render("login.handlebars");
});

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("database-portfolio.db");

db.run(
  "CREATE TABLE user(pid INTEGER PRiMARY KEY, pusername TEXT NOT NULL, ppassword TEXT NOT NULL, pemail TEXT NOT NULL)",
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
    }
  }
);

db.run(
  "CREATE TABLE messages(pid INTEGER PRIMARY KEY, pname TEXT NOT NULL, psurname TEXT NOT NULL, pemail TEXT NOT NULL, pmessage TEXT NOT NULL, pdate TEXT NOT NULL)",
  (error) => {
    if (error) {
      console.log("ERROR", error);
    } else {
      console.log("---> Table messages created!");

      const messages = [];

      messages.forEach((oneMessage) => {
        db.run(
          "INSERT INTO messages(pid, pname, psurname, pemail, pmessage, pdate) values (?,?,?,?,?,?)",
          [
            oneMessage.id,
            oneMessage.img,
            oneMessage.name,
            oneMessage.desription,
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
  "CREATE TABLE projects (pid INTEGER PRIMARY KEY, pimg TEXT NOT NULL, pname TEXT NOT NULL, pdescription TEXT NOT NULL, pdate REAL NOT NULL)",
  (error) => {
    if (error) {
      console.log("ERROR", error);
    } else {
      console.log("---> Table projects created!");

      const projects = [
        {
          id: "1",
          img: "/public/img/stylization-minnie-mouse.jpg",
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
          "INSERT INTO projects(pid, pimg, pname, pdesription, pdate) values (?,?,?,?,?)",
          [
            oneProject.id,
            oneProject.img,
            oneProject.name,
            oneProject.desription,
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
  "CREATE TABLE projectTag (ptid INTEGER PRIMARY KEY, pid INTEGER, tid INTEGER, FOREIGN KEY (pid) REFERENCES projects, FOREIGN KEY (tid) REFERENCES tag",
  (error) => {
    if (error) {
      console.log("ERROR", error);
    } else {
      console.log("---> Table projectTag created!");

      const projectTag = [];

      projectTag.forEach((oneProjectTag) => {
        db.run(
          "INSERT INTO projectTag(ptid, pid, tid) values (?,?, ?)",
          [oneProjectTag.id, oneProjectTag.pid, oneProjectTag.tid],
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
  "CREATE TABLE tag (pid INTEGER PRIMARY KEY, ptagname TEXT NOT NULL",
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
          "INSERT INTO tag(pid, ptaganem) values (?,?)",
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
