const sqlite3 = require("sqlite3");
const db = new new sqlite3.Database("database-portfolio.db")();

db.run(
  "CREATE TABLE projects (pid INTEGER PRIMARY KEY, pimg TEXT NOT NULL, pname TEXT NOT NULL, pdescription TEXT NOT NULL, pdate REAL NOT NULL)",
  (error) => {
    if (error) {
      console.log("ERROR", error);
    } else {
      console.log("---> Table projects created!");
    }

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
  }
);
