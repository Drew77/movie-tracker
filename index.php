<!DOCTYPE html>
<html>
    <head> 
        <title>Movies</title>
        <link rel="stylesheet" href="styles.css" type="text/css" />
    </head>
    
    <body>
        <div class="overlay"></div>
        <h1>Movie Database</h1>
        <div class="container">
            
            
            <div class="movies-table">
                <div class="title">
                    <div>Title</div>
                    <div>Bio</div>
                    <div>Released On</div>
                    <div>Genres</div>
                </div>
                <?php
                    include("database.php");
                    $movies = $db->getTable("Movies");
                    
                    foreach ( $movies as $i => $movie){
                        $genres = $db->getGenres($movie->id)
                        ?>
                        <div class="movie" data-id="<?= $movie->id?>">
                           <div class="movie-title"><?=$movie->title?></div> 
                           <div class="movie-description"><?=$movie->description?></div> 
                           <div class="movie-released"><?=$movie->release_date?></div> 
                           <div class="movie-genres"><?= implode(" ",$genres) ?></div>
                        </div>
                  <?php  }
                ?>
            </div>
            
            <form id="addmovies" method="post" action="addmovie.php">
                <div class="input-container">
                    <input id="title" type="text" name="title" autocomplete="off">
                    <label for="title">Movie Title</label>
                    <div class="suggestions">
                        <div class="suggestion">Shrek</div>
                    </div>
                </div>
                <div class="textarea-container">
                    <textarea id="description" type="text" name="description" autocomplete="off"></textarea>
                    <label for="description">Description</label>
                    
                </div>
                <div class="input-container">    
                    <input id="release_date" type="text" name="release_date" autocomplete="off">
                    <label for="release_date">Release Date</label>
                </div>
                <button>Submit</button>
            </form>
        </div>
         
          
        <script type="text/javascript" src="scripts.js"></script>
    </body>
</html>

