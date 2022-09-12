const express = require("express");
const cors = require("cors");
const data = require("./movies.json");
const users = require("./data/users.json");
const Database = require("better-sqlite3");

// DB
const db = new Database("./src/db/database.db", { verbose: console.log });

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

// server.get("/movies", (req, resp) => {
//   const genderFilterParam = req.query.gender;
//   let filterGender = data.movies;

//   if (genderFilterParam && genderFilterParam !== "") {
//     filterGender = data.movies.filter(
//       (movie) => movie.gender === genderFilterParam
//     );
//   }

//   resp.json({ success: true, movies: filterGender });
// });

server.get("/movies", (req, resp) => {
  const genderFilterParam = req.query.gender;
  let movies = [];
  if (req.query.gender === "") {
    const query = db.prepare("SELECT * FROM movies");
    movies = query.all();
  } else {
    const query = db.prepare("SELECT * FROM movies WHERE gender = ?");
    movies = query.all(genderFilterParam);
  }

  console.log(movies);
  resp.json({ success: true, movies: movies });
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
  const movieId = req.params.movieId;
  const query = db.prepare("SELECT * FROM movies WHERE id = ?");
  const movie = query.get(movieId);

  res.render("pages/movie", movie);
});


server.post("/signup", (req, res) => {
  const query = db.prepare(
    'INSERT INTO users (email, password) VALUES (?, ?)'
    );
    const result = query.run(req.body.email, req.body.password);
    console.log(result);
    res.json(result);
});

server.get('/user/movies', (req, res) => {
  // preparamos la query para obtener los movieIds
  const movieIdsQuery = db.prepare(
    'SELECT movieId FROM rel_movies_users WHERE userId = ?'
  );
  // obtenemos el id de la usuaria
  const userId = req.header('user-id');
  // ejecutamos la query
  const movieIds = movieIdsQuery.all(userId); // que nos devuelve algo como [{ movieId: 1 }, { movieId: 2 }];

  // obtenemos las interrogaciones separadas por comas
  const moviesIdsQuestions = movieIds.map((id) => '?').join(', '); // que nos devuelve '?, ?'
  // preparamos la segunda query para obtener todos los datos de las películas
  const moviesQuery = db.prepare(
    `SELECT * FROM movies WHERE id IN (${moviesIdsQuestions})`
  );

  // convertimos el array de objetos de id anterior a un array de números
  const moviesIdsNumbers = movieIds.map((movie) => movie.movieId); // que nos devuelve [1.0, 2.0]
  // ejecutamos segunda la query
  const movies = moviesQuery.all(moviesIdsNumbers);

  // respondemos a la petición con
  res.json({
    success: true,
    movies: movies,
  });
});


//La ruta base del static server empieza a raíz de proyecto (package.json)

const staticServer = "./src/public-react";
server.use(express.static(staticServer));

const staticServerPics = "./src/public-movies-images";
server.use(express.static(staticServerPics));

const staticServerStyles = "./src/public-styles";
server.use(express.static(staticServerStyles));
