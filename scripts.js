
const textInputs = document.querySelectorAll('form input[type="text"]');
const textareas = document.querySelectorAll('textarea');
const addMovies = document.querySelector("#addmovies");
const movieTitle = document.querySelector("#title");
const moviesTable = document.querySelector(".movies-table");
const suggestionsContainer = document.querySelector(".suggestions");

textInputs.forEach(function(input){
    input.addEventListener("focus", function(e){
        this.nextElementSibling.classList.add("move-label");
    })
});

textInputs.forEach(function(input){
    input.addEventListener("blur", function(e){
        if(this.value === ""){
            this.nextElementSibling.classList.remove("move-label");
        }
        
    })
});

textareas.forEach(function(input){
    input.addEventListener("focus", function(e){
        this.nextElementSibling.classList.add("move-label");
    })
});

textareas.forEach(function(input){
    input.addEventListener("blur", function(e){
        if(this.value === ""){
            this.nextElementSibling.classList.remove("move-label");
        }
    })
});

addMovies.addEventListener('submit', submitForm);


function submitForm(e){
    e.preventDefault();
    const action = this.action;
    const data = makeurl(this);
    fetch(action, {
    body: data,
    method: "POST",
      headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
     },
    }).then(function(response){
        return response.json();
    })
    .then(function(data){
        let {id, title, released, description, genres} = data;
        let moviehtml = moviesTable.innerHTML;
        moviehtml += `<div class="movie collapse" data-id="${id}">
                           <div class="movie-title">${title}</div> 
                           <div class="movie-description">${description}</div> 
                           <div class="movie-released">${released}</div> 
                           <div class="movie-genres">${genres}</div>
                        </div>`;
        moviesTable.innerHTML = moviehtml;
        setInterval( function() {
            moviesTable.lastChild.classList.remove("collapse");
            }, 100);
    }).catch(function(e) {
        
    });
}

function makeurl(form){
    var formBody = [];
    for (var i = 0; i < form.length - 1; i++) {
      var encodedKey = encodeURIComponent(form[i].name);
      var encodedValue = encodeURIComponent(form[i].value);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return formBody;
}

let movies;

getMovies();

function getMovies(){
    fetch("https://php-projects-amail.c9users.io/movies/movies.php")
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        movies =  myJson;
    });
}

movieTitle.addEventListener("keyup", checkMovie);

function checkMovie(e){
    if (this.value.length > 2){
        let searchTerm = this.value.toLowerCase();
        let matches = movies.filter( function(movie) {
          return movie.toLowerCase().includes(searchTerm);
        });
        setSuggestions(matches.slice(0,10));
    }
}

function setSuggestions(suggestions){
    let html = suggestions.map(suggestion => `<div class="suggestion">${suggestion}</div>`).join("");
    suggestionsContainer.innerHTML = html;
    suggestionsContainer.classList.add("active");
}


document.addEventListener("click", function(e){
    if (e.target.classList.contains("suggestion")){
        movieTitle.value = e.target.textContent;
    }
    suggestionsContainer.classList.remove("active");
    suggestionsContainer.innerHTML = "";
});

moviesTable.addEventListener("click", function(e){
    const target = e.target.classList.contains("movie") ? e.target : e.target.parentElement;
    const movieID = target.dataset.id;
    app.domElements.overlay.classList.add("active");
    app.movieDetails.getMovie(movieID);
})




const app = {
    init: function() {
        this.overlay.init();
    },
    domElements : {
      
    },

    overlay: {},
    editForm: {},
    
}

app.overlay = {
    init: function() {
        this.cacheDomElements();
        this.addEventListeners();
    },
    cacheDomElements: function(){
        app.domElements.overlay = document.querySelector(".overlay");
    },
    addEventListeners: function(){
        app.domElements.overlay.addEventListener("click", this.toggleOverlay);
    },
    toggleOverlay: function() {
        app.domElements.overlay.classList.toggle("active");
    }
}


app.movieDetails = {
    getMovie: function(id){
        fetch("/getMovie.php", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id})
        })
        .then(function(res){
            return res.json();
        })
        .then(function(data){
            console.log(data)
        })
    }
}

app.editForm = {
    html: `<form method="puts" action="/editMovie.php">
           <form>`
}

app.init();