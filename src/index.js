const express = require("express");
const cors = require("cors");
const data = require("./movies.json");
const users = require("./data/users.json");

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

//import ejs (template engine)

server.set("view engine", "ejs");

server.get("/movies", (req, resp) => {
  const genderFilterParam = req.query.gender;
  let filterGender = data.movies;

  if (genderFilterParam && genderFilterParam !== "") {
    filterGender = data.movies.filter(
      (movie) => movie.gender === genderFilterParam
    );
  }

  resp.json({ success: true, movies: filterGender });
});

server.post("/login", (req, resp) => {
  console.log(req.body);
  let userLogin = users.find(
    (user) =>
      user.email === req.body.email && user.password === req.body.password
  );

  console.log(userLogin);

  //si userLogin existe y tiene algún valor

  if (userLogin) {
    resp.json({
      success: true,
      userId: userLogin.id,
    });
  } else {
    resp.json({
      success: false,
      errorMessage: "Usuaria/o no encontrada/o",
    });
  }
});

//endpoint para motor de plantillas

server.get("/movie/:movieId", (req, res) => {
  console.log(req.params.movieId);
  const foundMovie = data.movies.find(
    (movie) => movie.id === req.params.movieId
  );
  console.log(foundMovie);
  res.render("pages/movie", foundMovie);
});

//La ruta base del static server empieza a raíz de proyecto (package.json)

const staticServer = "./src/public-react";
server.use(express.static(staticServer));

const staticServerPics = "./src/public-movies-images";
server.use(express.static(staticServerPics));
