const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const MOVIES = require("./movies.json");
// console.log(MOVIES[0]);
const app = express();

//Helper Function
validateBearerToken = (req, res, next) => {
  debugger;
  const authToken = req.get("Authorization");

  // const apiToken = process.env.API_TOKEN;
  const apiToken =  "fake"
  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({
      code: 401,
      error: "Unauthorized request"
    });
  }

  next();
};
testAuthAtRoot = (req, res) => {
  return res.status(200).json({
    code: 200,
    message: "Authorization successful"
  });
};
//Middleware

app.use(helmet());
app.use(validateBearerToken);
app.use(morgan("dev"));
app.use(cors());

//Error Handle
app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    response = { error };
  }
  res.status(500).json(response);
});

//Res Functions

handleGetMovies = (req, res) => {
  let { film_title = "", genre, country, avg_vote } = req.query;
  let movies = MOVIES;

  if (film_title) {
    movies = movies.filter(movie =>
      movie.film_title
        .toLowerCase()
        .includes(req.query.film_title.toLowerCase())
    );
  }

  if (genre) {
    movies = movies.filter(movie =>
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }

  if (country) {
    movies = movies.filter(movie =>
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    );
  }

  if (avg_vote) {
    movies = movies.filter(movie => movie.avg_vote >= parseInt(avg_vote));
  }

  res.json({ movies });
};

app.get("/movies", handleGetMovies);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
