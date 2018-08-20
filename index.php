<!DOCTYPE html>
<html>
    <?php include('database.php') ?>
    <head> 
        <title>Movie Tracker</title>
        <link rel="stylesheet" href="styles.css" type="text/css" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    
    <body>
       <div class="overlay"></div>
        <header>
            <h1>What Have You Been Watching?</h1>
            <?php if(isset($_SESSION["user"])) { ?>
                <div class="account__options logout"><?= $_SESSION["user"] ?></div>
            <?php } else { ?>
                <div class="account__options">Account</div>
            <?php } ?>
        </header>
        <div class="container">
            <form class="search-movies" method="get" action="findmovie.php">
                <div class="input-container">
                    <input id="title" type="text" class="search-input" name="title" autocomplete="off">
                    <button>Find Movie</button>
                    <div class="suggestions">
                        
                    </div>
                </div>
            </form>
        </div>
        <div class="container movies">
            <?php if (isset ($_SESSION["id"]) ) {
                $usermovies = $db->getMovies($_SESSION["id"]); ?>
                <div class="movies-grid">
                    <?php foreach ( $usermovies as $movie) { ?>
                        <div class="movie--outer">
                            <div class="movie--inner">
                                <div class="movie-overlay">
                                    
                                </div>
                                <div class="movie--inner--details">
                                    <h4><?= $movie->title?></h4>
                                    <h4>Seen on <?= $movie->date_seen?></h4>
                                    <h4><?= $movie->rating?> Stars</h4>
                                    <button class="remove-movie" data-id="<?=$movie->movieID?>">Remove Movie</button>
                                </div>
                                <img class="movie-grid--image" src="http://image.tmdb.org/t/p/w342/<?= $movie->Poster ?>" alt="<?php $movie->title?>">
                            </div>
                        </div>
                    <?php } ?>
                </div>
            <?php } ?>
         </div>
        <script type="text/javascript" src="scripts.js"></script>
        
    </body>
</html>

