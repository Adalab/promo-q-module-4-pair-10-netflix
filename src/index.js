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
