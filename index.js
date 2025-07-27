const apiKey = '2a0a1b2d';
const searchBtn = document.querySelector('#search-button');
const searchInput = document.querySelector('#search-input');
const resultsContainer = document.querySelector('#results');
const h3El = document.querySelector('h3');
let movies = [];
let watchList = JSON.parse(localStorage.getItem('watchList')) || [];


async function getMovie(title) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${title}`);
    const data = await response.json();
    if (!data.Search) {
        resultsContainer.classList.remove('with-margin');
        resultsContainer.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    resultsContainer.classList.add('with-margin');
    movies = data.Search;
    resultsContainer.innerHTML = '';
    searchInput.value = '';
    for (let i = 0; i < movies.length; i++) {
        const movieResponse = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&t=${movies[i].Title}&y=${movies[i].Year}`);
        const movieData = await movieResponse.json();
        renderMovie(movieData);
    }
}

searchBtn.addEventListener('click', () => {
    if (searchInput.value) {
        getMovie(searchInput.value);
    } else {
        searchInput.placeholder = 'Please enter a movie title...';
    }
});


function addToWatchlist(movie) {
    const alreadyExists = watchList.some(item => item.imdbID === movie.imdbID);
    if (alreadyExists) {
        console.log("La película ya está en la lista");
        return; // evita duplicado
    }

    watchList.push(movie);
    localStorage.setItem('watchList', JSON.stringify(watchList));
    console.log("Película agregada");
};


function renderMovie(movie) {
    console.log(movie);
    const movieDiv = document.createElement('div');
    movieDiv.classList.add('movie');
    movieDiv.innerHTML = `
        <img src="${movie.Poster !== "N/A" ? movie.Poster : './images/no_poster.png'}" onerror="this.onerror=null;this.src='./images/no_poster.png';" alt="${movie.Title}">
        <div class="movie-info">
            <div class="movie-info-header">
                <h3>${movie.Title.length > 25 ? movie.Title.slice(0, 25) + '...' : movie.Title}</h3 >
                <p>${movie.Year}</p>
                <p><i class="fa-solid fa-star"></i> ${movie.imdbRating}</p>
            </div >
            <ul>
                <li>${movie.Runtime}</li>
                <li>${movie.Genre}</li>
                <button class="add-to-watchlist" data-id="${movie.imdbID}"><i class="fa-solid fa-circle-plus"></i> Add to Watchlist</button>
            </ul>
            <div class="plot">
                <p class="plot-text">${movie.Plot}</p>
            </div>
        </div >
        `;
    resultsContainer.appendChild(movieDiv);
    const watchlistBtn = movieDiv.querySelector('.add-to-watchlist');
    watchlistBtn.addEventListener('click', async (e) => {
        const button = e.target.closest('.add-to-watchlist');
        if (!button) return;

        const imdbID = button.dataset.id;

        addToWatchlist(movie);
    });
};

