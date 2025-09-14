// -------------------------------------------------------------------------
// --------------------MOVIES LIST-------------------------------
// -------------------------------------------------------------------------

const fetchMoviesList = async () => {
  const url = "https://api.themoviedb.org/3/movie/now_playing";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NGNkNzE0NzM0ZmFhNjI4MzViNTFkYWY2ZTc4YjFkNCIsIm5iZiI6MTc1NjI5MDYxMi4xMzkwMDAyLCJzdWIiOiI2OGFlZGUzNDY5NDJmMTdhOWIzZDhhNTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HEvvFu1cWbtbV__4HPN8rwvZa591F7wobIHmWxr2yS4",
    },
  };
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result.results || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
class MoviesData {
  constructor() {
    this.moviesList = [];
    this.moviesDetails = [];
    this.popularMovies = [];
  }
  async fetchMovies() {
    this.moviesList = await fetchMoviesList();
    return this.moviesList;
  }

  async getMoviesDetails(id) {
    this.moviesDetails = await fetchMoviesDetails(id);
    return this.moviesDetails;
  }

  async getPopularMovies() {
    this.popularMovies = await fetchMoviesPopular();
    return this.popularMovies;
  }
}

// -------------------------------------------------------------------------
// --------------------MOVIES Details-------------------------------
// -------------------------------------------------------------------------

const fetchMoviesDetails = async (id) => {
  const url = `https://api.themoviedb.org/3/movie/${id}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NGNkNzE0NzM0ZmFhNjI4MzViNTFkYWY2ZTc4YjFkNCIsIm5iZiI6MTc1NjI5MDYxMi4xMzkwMDAyLCJzdWIiOiI2OGFlZGUzNDY5NDJmMTdhOWIzZDhhNTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HEvvFu1cWbtbV__4HPN8rwvZa591F7wobIHmWxr2yS4",
    },
  };
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result.genres || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// -------------------------------------------------------------------------
// --------------------MOVIES POPULAR-------------------------------
// -------------------------------------------------------------------------

const fetchMoviesPopular = async () => {
  const url =
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NGNkNzE0NzM0ZmFhNjI4MzViNTFkYWY2ZTc4YjFkNCIsIm5iZiI6MTc1NjI5MDYxMi4xMzkwMDAyLCJzdWIiOiI2OGFlZGUzNDY5NDJmMTdhOWIzZDhhNTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HEvvFu1cWbtbV__4HPN8rwvZa591F7wobIHmWxr2yS4",
    },
  };
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result.results || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
export default MoviesData;

// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NGNkNzE0NzM0ZmFhNjI4MzViNTFkYWY2ZTc4YjFkNCIsIm5iZiI6MTc1NjI5MDYxMi4xMzkwMDAyLCJzdWIiOiI2OGFlZGUzNDY5NDJmMTdhOWIzZDhhNTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HEvvFu1cWbtbV__4HPN8rwvZa591F7wobIHmWxr2yS4'
//   }
// };

// fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
//   .then(res => res.json())
//   .then(res => console.log(res))
//   .catch(err => console.error(err));
