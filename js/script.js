import MoviesData from "./api.js";

const dropMenuBtn = document.getElementById("drop-menu-btn");
const filterBtn = document.getElementById("filter-btn");
let dropMenu = document.getElementById("drop-menu");
let filterMenu = document.getElementById("filter-menu");

// Toggle drop menu
dropMenuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropMenu.classList.toggle("drop-menu-active");
  // Close filter menu if open
  filterMenu.classList.remove("filter-menu-active");
});

// Toggle filter menu
filterBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  filterMenu.classList.toggle("filter-menu-active");
  // Close drop menu if open
  dropMenu.classList.remove("drop-menu-active");
});

// Handle drop menu item selection
const menuItems = document.querySelectorAll(".menu-item");
menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Remove active class from all items
    menuItems.forEach((i) => i.classList.remove("active"));
    // Add active class to clicked item
    item.classList.add("active");

    // Update button text
    const buttonText = dropMenuBtn.querySelector("span");
    const itemText = item.querySelector("span").textContent;
    buttonText.textContent = itemText;

    // Close menu
    dropMenu.classList.remove("drop-menu-active");
  });
});

// Close menus when clicking outside
document.addEventListener("click", (e) => {
  if (!dropMenu.contains(e.target) && !dropMenuBtn.contains(e.target)) {
    dropMenu.classList.remove("drop-menu-active");
  }
  if (!filterMenu.contains(e.target) && !filterBtn.contains(e.target)) {
    filterMenu.classList.remove("filter-menu-active");
  }
});

// Handle filter changes
const languageRadios = document.querySelectorAll('input[name="language"]');
const mediaRadios = document.querySelectorAll('input[name="media"]');

languageRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    console.log("Language filter changed to:", radio.value);
    // Add your filtering logic here
  });
});

mediaRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    console.log("Media filter changed to:", radio.value);
    // Add your filtering logic here
  });
});

// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// ----------------------------------ADD POPULAR MOVIES PAGE---------------------------
// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
const pageTitle = document.getElementById("page-title");
const box = document.getElementById("box");
const popularLink = document.getElementById("popular-page");
const basisImgUrl = "https://image.tmdb.org/t/p/original";
const popularMovies = new MoviesData();

async function showPopularMovies() {
  console.log("showPopularMovies called");
  if (!box) return;
  box.innerHTML = "";
  pageTitle.textContent = " Most Popular Movies";
  const data = await popularMovies.getPopularMovies();
  // persist the popular list so details page can read the correct list
  try {
    sessionStorage.setItem("moviesList", JSON.stringify(data));
  } catch (e) {
    console.warn("Could not persist popular movies list to sessionStorage", e);
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
                <button class="play" onclick="handlePlayClick(${data[i].id}, ${i}, 'popular')"><i class="fa-solid fa-play"></i></button>
            </div>
        </div>
    `;
  }
}

// expose globally so header can call it
window.showPopularMovies = showPopularMovies;

// keep existing behavior for the original link
popularLink.addEventListener("click", (e) => {
  e.preventDefault();
  showPopularMovies().catch((err) => console.error(err));
});
