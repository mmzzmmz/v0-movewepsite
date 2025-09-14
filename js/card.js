import MoviesData from "./api.js";

const box = document.getElementById("box");
const detailsContainer = document.getElementById("details-container");

const moviesData = new MoviesData();

const basisImgUrl = "https://image.tmdb.org/t/p/original";
const getCardData = async () => {
  // update page title when rendering new movies (if present)
  const pageTitleEl = document.getElementById("page-title");
  if (pageTitleEl) pageTitleEl.textContent = "New Added Movies";
  // clear existing cards before rendering to avoid duplicates
  if (box) box.innerHTML = "";
  // try to use cached movies list saved earlier to avoid refetching
  let data;
  try {
    const cached = sessionStorage.getItem("moviesList");
    data = cached ? JSON.parse(cached) : await moviesData.fetchMovies();
  } catch (e) {
    console.warn("Failed to read cached movies list, fetching instead", e);
    data = await moviesData.fetchMovies();
  }
  // keep a copy of the current movies list so details page can access it after redirect
  try {
    sessionStorage.setItem("moviesList", JSON.stringify(data));
  } catch (e) {
    console.warn("Could not persist movies list to sessionStorage", e);
  }
  for (let i = 0; i < data.length; i++) {
    box.innerHTML += `
        <div class="card">
            <img
              src="${basisImgUrl}${data[i].poster_path}"
              alt="failed to load image"/>
            <div class="container-text">
              <h1 class="movies-title">${data[i].original_title}</h1>
              <span class="date">${data[i].release_date}</span>
              <span class="sub-title">${data[i].popularity}</span>
            </div>
            <div class="back">
                <h1>${data[i].original_title}</h1>
                <div class="movie-info">
                    <span class="rank">${data[i].vote_average}</span>
                    <span class="date">${data[i].release_date}</span>
                </div>
                <p class="description">${data[i].overview}</p>
                <button class="play" onclick="handlePlayClick(${data[i].id}, ${i}, 'new')"><i class="fa-solid fa-play"></i></button>
            </div>
        </div>
    `;
  }
};

// Expose getCardData so other scripts (header click handlers) can request a re-render
window.getCardData = getCardData;

// Only build the cards when the container exists (i.e. on index page)
if (box) getCardData();

// When user clicks play, store the selected movie and redirect to details page
function handlePlayClick(id, index, source = "new") {
  try {
    sessionStorage.setItem("movieId", String(id));
    sessionStorage.setItem("movieIndex", String(index));
    // remember which nav should be active on the details page
    try {
      sessionStorage.setItem("activeNav", source);
    } catch (e) {}
    // navigate to details page where the stored id will be used to render
    window.location.href = "../html/details.html";
  } catch (e) {
    console.error("Failed to store movie selection", e);
  }
}
window.handlePlayClick = handlePlayClick;

async function getMoviesDetailsById(id, index) {
  const moviesDetails = new MoviesData();
  const detailsData = await moviesDetails.getMoviesDetails(id);
  // prefer the persisted movies list (so details work for both New and Popular lists)
  let data;
  try {
    const cached = sessionStorage.getItem("moviesList");
    data = cached ? JSON.parse(cached) : await moviesData.fetchMovies();
  } catch (e) {
    console.warn(
      "Failed to read cached movies list for details, fetching instead",
      e
    );
    data = await moviesData.fetchMovies();
  }

  detailsContainer.style.backgroundImage = `url("${basisImgUrl}${data[index].poster_path}")`;
  detailsContainer.innerHTML = `
    <div class="content">
        <h1>${data[index].original_title}</h1>
        <span class="sub">sub|Dub</span>
        <span class="voit">${data[index].vote_average} | ${
    data[index].vote_count
  }</span>
        <div class="btn-container">
          <button class="btn-watch">
            <i class="fa-regular fa-circle-play"></i>
            <span>Start Watching</span>
          </button>
          <button class="save">
            <i class="fa-regular fa-bookmark"></i>
          </button>
          <button class="add">
            <i class="fa-solid fa-plus"></i>
          </button>
          <button class="share">
            <i class="fa-regular fa-share-from-square"></i>
          </button>
          <button class="more-option">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>
        </div>
      </div>
      <div class="details-container">
        <div class="overview-content">
          <p>${data[index].overview}</p>
        </div>

        <div class="details-content">
          <span class="audio"><span class="sub-span">audio:</span> ${
            data[index].original_language
          }</span>
          <p class="subtitles">
            <span class="sub-span">Subtitles:</span> English, Deutsch, Español
            (América Latina), Español (España), Français, Italiano, Português
            (Brasil), Русский
          </p>
          <span class="genres"
            ><span class="sub-span">Genres:</span> ${detailsData
              .map((g) => g.name)
              .join(", ")}</span
          >
        </div>
      </div>
  `;
}
window.getMoviesDetailsById = getMoviesDetailsById;

// If this script runs on the details page, try to render the selected movie
if (detailsContainer) {
  const storedId = sessionStorage.getItem("movieId");
  const storedIndex = sessionStorage.getItem("movieIndex");
  if (storedId !== null && storedIndex !== null) {
    // call the renderer using the stored values
    getMoviesDetailsById(Number(storedId), Number(storedIndex)).catch((e) =>
      console.error("Failed to render movie details:", e)
    );
  }
}

// If this script runs on the index page, check whether another page requested to open here
if (box) {
  try {
    const openPage = sessionStorage.getItem("openPage");
    if (openPage) {
      // remove marker so subsequent reloads don't re-open it
      sessionStorage.removeItem("openPage");
      if (
        openPage === "popular" &&
        typeof window.showPopularMovies === "function"
      ) {
        window
          .showPopularMovies()
          .catch((e) =>
            console.error("Failed to open popular after redirect", e)
          );
      } else {
        // default to new
        getCardData().catch((e) =>
          console.error("Failed to open new after redirect", e)
        );
      }
    }
  } catch (e) {
    console.warn("Error checking openPage marker", e);
  }
}
