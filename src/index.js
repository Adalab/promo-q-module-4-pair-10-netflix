const express = require("express");
const cors = require("cors");
const data = require("./movies.json");

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

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

//La ruta base del static server empieza a raíz de proyecto (package.json)

const staticServer = "./src/public-react";
server.use(express.static(staticServer));

const staticServerPics = "./src/public-movies-images";
server.use(express.static(staticServerPics));
