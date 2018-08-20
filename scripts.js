const app = {
    init: function() {
        this.overlay.init();
        this.movieDetails.init();
        this.movieTable.init();
        this.movieSearch.init();
        this.account.init();
    },
    domElements: {

    },
    seen: [],
    user: "",
}

app.movieSearch = {
    init: function() {
        this.cacheDomElements();
        this.addEventListeners();
        this.storeMovies();
    },
    movies: [],
    cacheDomElements: function() {
        app.domElements.searchMovies = document.querySelector(".search-movies");
        app.domElements.suggestionsContainer = document.querySelector(".suggestions");
        app.domElements.movieTitle = document.querySelector("#title");

    },
    addEventListeners: function() {
        app.domElements.searchMovies.addEventListener('submit', app.movieSearch.displayMovie);
        document.addEventListener("click", function(e) {
            if (e.target.classList.contains("suggestion")) {
                app.movieDetails.getMovie(e.target.dataset.id);
                app.overlay.toggleOverlay();
            }
            app.domElements.suggestionsContainer.classList.remove("active");
            app.domElements.suggestionsContainer.innerHTML = "";
            app.domElements.movieTitle.addEventListener("keyup", app.movieSearch.checkMovie);
        });

    },
    displayMovie: function(e) {
        if (!app.domElements.movieTitle.dataset.id) {
            e.preventDefault();
            return;
        }
        e.preventDefault();
        let id = app.domElements.movieTitle.dataset.id;
        app.overlay.toggleOverlay();
        app.movieDetails.getMovie(id);
    },
    setSuggestions: function(suggestions) {
        if (suggestions.length === 0) {
            app.domElements.suggestionsContainer.innerHTML = '';
        }
        let html = suggestions.map(suggestion => `<div class="suggestion" data-id="${suggestion.movieID}" data-title="${suggestion.title}">
                                                    <div class="suggestion-text">
                                                        <div>${suggestion.title}</div>
                                                        <div>${(new Date(suggestion.Released)).getFullYear()}</div>
                                                    </div>
                                                    <div class="suggestion-poster">
                                                        <img src="http://image.tmdb.org/t/p/w185//${suggestion.Poster}" alt="${suggestion.title}">
                                                    </div>
                                                  </div>`).join("");
        app.domElements.suggestionsContainer.innerHTML = html;
        app.domElements.suggestionsContainer.classList.add("active");
    },
    checkMovie: function(e) {
        if (app.domElements.movieTitle.value.length > 2) {
            let searchTerm = app.domElements.movieTitle.value.toLowerCase();
            let matches = app.movieSearch.movies.filter((movie) => movie.title.toLowerCase().includes(searchTerm));
            app.movieSearch.setSuggestions(matches.slice(0, 10));
        }
        else {
            app.movieSearch.setSuggestions([]);
        }
    },
    getMovies: async function() {
        const response = await fetch(`https://php-projects-amail.c9users.io/movies/loadMovies.php`);
        let movies = await response.json();
        return movies;
    },

    storeMovies: function() {
        let movies = this.getMovies();
        movies.then(function(movies) {
            app.movieSearch.movies = movies;
        })
    },

    getMovie: async function(id) {
        const response = await fetch(`https://php-projects-amail.c9users.io/movies/getMovieTMDB.php?id=${id}`);
        let movie = await response.json();
        return movie;
    },

};


app.overlay = {
    init: function() {
        this.addEventListeners();
    },
    addEventListeners: function() {
        document.body.addEventListener("click", function(e) {
            if (e.target.classList.contains("overlay")) {
                app.overlay.toggleOverlay();
            }
        });
    },
    toggleOverlay: function() {
        const overlay = document.querySelector(".overlay");
        overlay.classList.toggle("active");
        if (!overlay.classList.contains("active")) {
            let movieDetails = document.querySelector(".movie-details");
            if (movieDetails) {
                document.body.removeChild(movieDetails);
            }
            let accountContainer = document.querySelector(".account-container");
            if (accountContainer) {
                document.body.removeChild(accountContainer);
            }

        }
    },
};




app.movieTable = {
    init: function() {
        this.saveUserMovies();
        this.addEventListeners();
    },
    addEventListeners: function(){
      const movies = document.querySelectorAll('.movie--outer');
      if (movies){
        movies.forEach(movie => movie.addEventListener('click', app.movieTable.toggleMovieHover));  
      }
      let moviesContainer = document.querySelector('.container.movies');
      moviesContainer.addEventListener('transitionend', app.movieTable.showMovieDetails);
      moviesContainer.addEventListener('click', app.movieTable.removeMovie);
    },
    showMovieDetails: function(e){
        if (e.propertyName === "opacity" && e.target.parentElement.parentElement.classList.contains('active-movie') ){
             e.target.nextElementSibling.classList.add('show');
        }

    },
    removeMovie: function(e){
        if (e.target.classList.contains('remove-movie')){
            let id = e.target.dataset.id;
            fetch(`removeMovie.php?id=${id}`)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                app.seen = app.seen.filter(movie => movie.movieID != data);
                app.movieTable.renderMovieTable(app.seen);
            });
        }
    },
    toggleMovieHover: function(e){
        // if remove button clicked
        if (e.target.classList.contains('remove-movie')){
            return;
        }
        let movieContainer = e.target.parentElement.parentElement;
        // if has active, remove
        if(movieContainer.classList.contains('movie--outer') && movieContainer.classList.contains('active-movie')){
            movieContainer.classList.remove('active-movie');
        }
        
        else {
            //reset all to ensure only one active at a time
            app.movieTable.removeAllActiveMovies();
            movieContainer.classList.add('active-movie');
        }
        
        e.target.nextElementSibling.classList.remove('show');
    },
    removeAllActiveMovies: function() {
        let activeMovies = document.querySelectorAll('.active-movie');
        activeMovies.forEach(function(movie){
            movie.classList.remove('active-movie');
            let movieDetails = movie.querySelector('.show');
            if (movieDetails) {
                movieDetails.classList.remove('show');
            };
        })
    },
    saveUserMovies: function(){
        fetch('getUserMovies.php')
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            if(data) {
                app.seen = data[1];
                app.user = data[0];
            }
            
        })
    },
    renderMovieTable: function(movies){
        const moviescontainer = document.querySelector('.container.movies');
        let html = `<div class="movies-grid">`;
        html += movies.map(movie => {
            return `<div class="movie--outer">
                        <div class="movie--inner">
                            <div class="movie-overlay">
                            </div>
                            <div class="movie--inner--details">
                                <h4>${movie.title}</h4>
                                <h4>Seen on ${movie.date_seen}</h4>
                                <h4>${movie.rating} Stars</h4>
                                <button class="remove-movie" data-id="${movie.movieID}">Remove Movie</button>
                            </div>
                            <img class="movie-grid--image" src="http://image.tmdb.org/t/p/w342/${movie.Poster}" alt="${movie.title}">
                        </div>
                    </div>`;
        }).join('');
        html += '</div>';
        moviescontainer.innerHTML = html;
        app.movieTable.addEventListeners();
    },
    appendMovie: function(movie){
        let html = `<div class="movie--inner">
                            <div class="movie-overlay">
                            </div>
                            <div class="movie--inner--details">
                                <h4>${movie.title}</h4>
                                <h4>Seen on ${movie.date_seen}</h4>
                                <h4>${movie.rating} Stars</h4>
                                <button class="remove-movie" data-id="${movie.movieID}">Remove Movie</button>
                            </div>
                            <img class="movie-grid--image" src="http://image.tmdb.org/t/p/w342/${movie.Poster}" alt="${movie.title}">
                        </div>`;
                        
        let newMovie = document.createElement("div");
        newMovie.classList.add('movie--outer');
        newMovie.innerHTML = html;
        document.querySelector(".movies-grid").appendChild(newMovie);
        newMovie.addEventListener('click', app.movieTable.toggleMovieHover);  
        app.seen.push(movie);
    }
}

app.movieDetails = {
    init: function() {
        this.addEventListeners();
    },
    addEventListeners: function() {
        document.body.addEventListener("click", function(e) {
            if (e.target.classList.contains("btn-delete")) {
                app.movieDetails.deleteMovie(e.target.dataset.id);
            }
        });
    },
    getMovie: function(id) {
        let movieDiv = document.createElement("div");
        movieDiv.classList.add("movie-details");
        let loaderDiv = document.createElement("div");
        loaderDiv.classList.add("loader");
        movieDiv.appendChild(loaderDiv);
        document.body.appendChild(movieDiv);
        fetch(`getMovieTMDB.php?id=${id}`)
            .then(function(res) {
                return res.json();
            })
            .then(function(data) {
                app.movieDetails.render(data);
            });
    },


    render: function(data) {
        const movie = JSON.parse(data);
        const {
            original_title: title,
            poster_path: poster,
            overview: description,
            release_date: year,
            runtime: runtime,
            genres: genres
        } = movie;
        const movieSeen = hasUserSeen(movie.id, app.seen);
        const html = `<div class="movie-details--container">
                        <div class="movie-details__left">
                            <img class="movie-details__image" src="https://image.tmdb.org/t/p/w500//${poster}" alt="${title}">
                        </div>
                        <div class="movie-details__right">
                            <div class="movie-details__content">
                                <h2 class="movie-details__title">${title}</h2>
                                <p>${description}</p>
                                <ul class="movie-details__list">
                                    <li class="movie-details__list__item">Released: ${(new Date(year)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</li>
                                    <li class="movie-details__list__item">Run Time: ${toHours(runtime)}</li>
                                    <li class="movie-details__list__item">Genres: ${parseGenres(genres)}</li>
                                </ul>
                            </div>
                            ${app.user ? `
                            ${ movieSeen ? `<h3>Seen on ${movieSeen}</h3>` :
                            `<button class="btn btn-add" data-button="js-add" data-title="${title}" data-id="${movie.id}">Add Movie</button>`}` :
                            '<div class="account__options">Sign in to add the movie!</div>'}
                            
                        </div>
                    </div>`;
        const detailsDiv = document.querySelector('.movie-details');
        detailsDiv.innerHTML += html;
        const addButton = document.querySelector('.btn-add');
        
        // Button not present if movie seen
        if (addButton){
            addButton.addEventListener('click', app.movies.showAddMovieForm);
        }
        const loginButton = document.querySelector('.movie-details__right .account__options');
        if (loginButton) {
            loginButton.addEventListener("click", app.account.accountMenu);
        }
        
        setTimeout(function() {
            detailsDiv.firstChild.remove();
        }, 1000);


    },

}

app.movies = {
       init: function() {
    }, 
    showAddMovieForm: function(e){
        const id = e.target.dataset.id;
        const title = e.target.dataset.title;
        if (document.querySelector('.account-container')) {
            return;
        }
        app.overlay.toggleOverlay();
        let accountDiv = document.createElement("div");
        const html = app.movies.renderForm(title, id);
        accountDiv.innerHTML = html;
        accountDiv.classList.add("account-container");
        document.body.appendChild(accountDiv);
        document.querySelector('.add-movie-form').addEventListener('submit', app.movies.addMovie);
    },
    renderForm: function(title, id) {
        const months = ["January", "February", "March", "April", "May", "June", "July","August", "September", "October", "November", "December"];
        const today = new Date();
        const thisMonth = today.getMonth();
        const thisYear = today.getFullYear();
        const monthOptions = months.map((month, i) => `<option value=${i+1} ${i === thisMonth? 'selected="selected"' : ''}>${month}</option>`).join("");
        const numbers = Array.from(Array(31).keys());
        const dayOptions = numbers.map((day, i) => `<option ${i + 1 === today.getDate()? 'selected="selected"' : ''}>${day + 1}</option>`).join("");
        return `<form class="add-movie-form" data-id="${id}">
                    <h3 class="add-form--title"> When did you see ${title}</h3>
                    <div>
                        <div class="input-container">
                            <label class="add-form__label">Day</label>
                            <Select name="day">${dayOptions}</select>
                        </div>
                        <div class="input-container"> 
                            <label class="add-form__label">Month</label>
                            <Select name="month">${monthOptions}</select>
                        </div>
                        <div class="input-container"> 
                            <label class="add-form__label">Year</label>
                            <input type="number" name="year" value="${thisYear}" max="${thisYear}">  
                        </div>
                    </div>
                   <h3 class="add-form--title">What Rating</h3>
                   <div class="input-container"> 
                        <label class="add-form__label">Rating</label>
                        <input type="number" value="5" name="rating" min="0" max="10">
                   </div>
                   <button class="btn add-movie">Submit</button>
                <form>`
    },
    addMovie: function(e) {
        e.preventDefault();
        const form = e.target;
        // Add Movie To users list
        const formData = { 
            day: form.day.value,
            month: form.month.value,
            year: form.year.value,
            rating: form.rating.value,
            movieID: e.target.dataset.id
        };
        e.preventDefault();
        fetch(`addmovie.php`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'applicatiion/json'
            },
            body: JSON.stringify(formData)
        })
        .then(function(res) {
            return res.json()
        })
        .then(function(data) {
            let container = document.querySelector('.account-container');
            if (data === "seen"){
                app.account.displayError(container, "Seen");
            }
            else if (data != "0") {
                app.movieTable.appendMovie(data.movie);
            }
            else {
                 app.account.displayError(container, "Movie Not Added");   
            }
            container.classList.add('fade-out');
            container.addEventListener('transitionend', function(){
                this.remove();
            })

        });
    }
}

app.account = {
    init() {
        this.addEventListeners();
    },
    addEventListeners() {
        document.querySelector('.account__options').addEventListener("click", this.accountMenu);
    },
    accountMenu(e) {
        if (e.target.classList.contains("logout")) {
            app.account.showLogout();
        }
        else {
            app.account.showAccount();
        }
    },
    showAccount() {
        if (document.querySelector('.account-container')) {
            return;
        }
        app.overlay.toggleOverlay();
        let accountDiv = document.createElement("div");
        let html = `<div class="toggle"><div class="sign-up tabs active">Sign Up</div><div class="Login tabs">Login</div></div>`;
        html += app.account.renderSignup();
        html += app.account.renderLogin();
        accountDiv.innerHTML = html;
        accountDiv.classList.add("account-container");
        document.body.appendChild(accountDiv);
        document.querySelector('.toggle').addEventListener('click', app.account.toggleAccountForm);
        document.querySelector('[data-type="sign-up"] input[name="username"]').addEventListener('blur', app.account.checkUserName);
        document.querySelector('[data-type="sign-up"] input[name="username"]').addEventListener('focus', app.account.resetInput);
        document.querySelector('[data-type="sign-up"]').addEventListener('submit', app.account.registerUser);
        document.querySelector('[data-type="login"]').addEventListener('submit', app.account.loginUser);
    },
    toggleAccountForm(e) {
        if (e.target.classList.contains("active")) {
            return;
        }
        document.querySelector('.tabs.active').classList.remove('active');
        e.target.classList.add('active');
        if (e.target.classList.contains("sign-up")) {

            document.querySelector('[data-type="login"]').classList.remove('active');
            document.querySelector('[data-type="sign-up"]').classList.add('active');
        }
        else {
            document.querySelector('[data-type="login"]').classList.add('active');
            document.querySelector('[data-type="sign-up"]').classList.remove('active');
        }
    },
    showLogout() {
        if (document.querySelector('.account-container')) {
            return;
        }
        app.overlay.toggleOverlay();
        let accountDiv = document.createElement("div");
        let html = `<button class="btn btn-signout">Sign Out</button>`;
        accountDiv.innerHTML = html;
        accountDiv.classList.add("account-container");
        document.body.appendChild(accountDiv);
        document.querySelector('.btn-signout').addEventListener('click', app.account.signOut);
    },
    signOut() {
        fetch(`logout.php`)
            .then(function(res) {
                return res.json()
            })
            .then(function(data) {
                setTimeout(function(){
                 app.overlay.toggleOverlay();
                let accountButton = document.querySelector('.account__options');
                accountButton.classList.remove('logout');
                accountButton.textContent = "Account";
                document.querySelector('.movies-grid').remove();
                app.seen = [];
                app.user = "";
            }, 500)


            });
    },
    loginUser(e) {
        e.preventDefault();
        const form = e.target;
        // validate passwords match
        const formData = { username: form.username.value, password: form.password.value };
        fetch(`login.php`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'applicatiion/json'
                },
                body: JSON.stringify(formData)
            })
            .then(function(res) {
                return res.json()
            })
            .then(function(data) {
                const container = document.querySelector('.account-container');
                if (data === "0") {
                    app.account.displayError(container, "Login Failed");
                    app.account.fadeOut(container);
                }
                else {
                    if (data.movies) {
                        app.movieTable.renderMovieTable(data.movies);
                        app.seen = data.movies;
                        app.user = data.id;
                    }
                    container.classList.add("signup-success");
                    container.innerHTML = `<div class="signup--complete">Welcome ${data.username} </div>`
                    setTimeout(function() {
                        container.classList.add('fade-out');
                        let accountButton = document.querySelector('.account__options');
                        accountButton.classList.add('logout');
                        accountButton.textContent = 'Logout';
                    }, 100);
                    setTimeout(function() {
                        app.overlay.toggleOverlay();
                    }, 2000);                   
                }
            })
    },
    
    fadeOut(container){
         setTimeout(function() {
            container.classList.add('fade-out');
        }, 100);
        container.addEventListener('transitionend', function(){
            container.remove();
            app.account.showAccount();                        
        });       
    },

    checkUserName(e) {
        const name = e.target.value;
        fetch(`checkUser.php?username=${name}`)
            .then(function(res) {
                return res.json()
            })
            .then(function(data) {
                if (data != 0) {
                    e.target.style.color = "white";
                    e.target.value = "";
                    e.target.placeholder = "Username is not available";
                    e.target.style.background = "red";
                }

            });
    },
    resetInput: function(e) {
        e.target.style.color = "#363636";
        e.target.placeholder = "Username";
        e.target.style.background = "white";
    },
    registerUser: function(e) {
        e.preventDefault();
        const form = e.target;
        // validate passwords match
        const formData = { username: form.username.value, password: form.password.value, passwordConfirm: form.passwordConfirm.value };
        fetch(`signup.php`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'applicatiion/json'
                },
                body: JSON.stringify(formData)
            })
            .then(function(res) {
                return res.json()
            })
            .then(function(data) {
                const container = document.querySelector('.account-container');
                if (data !== "") {
                    container.classList.add("signup-success");
                    container.innerHTML = `<div class="signup--complete">You have signed up as ${data} </div>`
                    setTimeout(function() {
                        container.classList.add('fade-out');
                        let accountButton = document.querySelector('.account__options');
                        accountButton.classList.add('logout');
                        accountButton.textContent = data;
                    }, 100);
                    setTimeout(function() {
                        app.overlay.toggleOverlay();
                    }, 2000);
                }
                else if (data == "Passwords do not match") {
                    app.account.displayError(container, "Passwords don't match");
                    app.account.fadeOut(container);
                }
                else {
                    app.account.displayError(container, "Signup Failed");
                    app.account.fadeOut(container);
                }
            });
    },

    displayError: function(container, message) {
        container.classList.add("signup-failure");
        container.innerHTML = `<div>${message}</div>`;
    },
    renderSignup: function() {
        return `<form class="account-form active" data-type="sign-up" method="POST" action="signup.php">
                    <input type="text" class="account-input" placeholder="Username" name="username" required>
                    <input type="password" class="account-input" placeholder="Password" name="password" required>
                    <input type="password" class="account-input" placeholder="Confirm Password" name="passwordConfirm" required>
                    <button class="btn btn-account">Signup</button>
                </form>`;
    },
    renderLogin: function() {
        return `<form class="account-form" data-type="login">
                    <input type="text" class="account-input" placeholder="Username" name="username" required>
                    <input type="password" class="account-input" placeholder="Password" name="password" required>
                    <button class="btn btn-account">Login</button>
                </form>`;
    }
}


app.init();

//helper functions

function toHours(duration) {
    let hours = Math.floor(duration / 60);
    let minutes = duration % 60;
    return `${hours} Hours${minutes === 0 ? "" : ` ${minutes} Minutes`}`;
}

function parseGenres(genres) {
    let html = genres.map(genre => genre.name).join(" ");
    return html;
}

function hasUserSeen(movieID, movies){
    const seen = movies.filter( movie => movie.movieID == movieID);
    if (seen.length === 0){
        return false;
    }
    return seen[0].date_seen;
}




/// Polyfills


// el.remove();
(function(arr) {
    arr.forEach(function(item) {
        if (item.hasOwnProperty('remove')) {
            return;
        }
        Object.defineProperty(item, 'remove', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function remove() {
                if (this.parentNode !== null)
                    this.parentNode.removeChild(this);
            }
        });
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
