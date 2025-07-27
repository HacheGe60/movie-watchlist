const rawWatchList = localStorage.getItem('watchList');
const watchlist = rawWatchList ? JSON.parse(rawWatchList) : [];
const resultsContainer = document.querySelector('#results');

resultsContainer.innerHTML = '';
console.log(watchlist);

function renderWatchlist(movies) {
    resultsContainer.innerHTML = '';
    resultsContainer.classList.remove('with-margin');

    if (movies.length > 0) {
        resultsContainer.classList.add('margin-top');
    } else {
        resultsContainer.classList.remove('margin-top');
        resultsContainer.innerHTML = `
            <div class="pre-search" id="pre-search">
                <p>Your watchlist is looking a little empty...</p>
                <a href="./index.html">
                    <i class="fa-solid fa-circle-plus"></i> Let's add some movies!
                </a>
            </div>
        `;
        return;
    }

    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');
        movieDiv.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : './images/no_poster.png'}" onerror="this.onerror=null;this.src='./images/no_poster.png';" alt="${movie.Title}">
            <div class="movie-info">
                <div class="movie-info-header">
                    <h3>${movie.Title.length > 25 ? movie.Title.slice(0, 25) + '...' : movie.Title}</h3>
                    <p>${movie.Year}</p>
                    <p><i class="fa-solid fa-star"></i> ${movie.imdbRating}</p>
                </div>
                <ul>
                    <li>${movie.Runtime}</li>
                    <li>${movie.Genre}</li>
                    <button class="remove-to-watchlist" data-id="${movie.imdbID}">
                        <i class="fa-solid fa-circle-minus"></i> Remove
                    </button>
                </ul>
                <div class="plot">
                    <p class="plot-text">${movie.Plot}</p>
                </div>
            </div>
        `;
        resultsContainer.appendChild(movieDiv);
        const watchlistBtn = movieDiv.querySelector('.remove-to-watchlist');
        watchlistBtn.addEventListener('click', () => {
            removeToWatchlist(movie);
        });

    });
}



function removeToWatchlist(movie) {
    const index = watchlist.findIndex(item => item.imdbID === movie.imdbID);
    if (index !== -1) {
        watchlist.splice(index, 1);
        localStorage.setItem('watchList', JSON.stringify(watchlist));
        renderWatchlist(watchlist);
    }

};

renderWatchlist(watchlist);