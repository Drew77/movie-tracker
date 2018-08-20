<?php

$movie_id = filter_var($_GET["id"], FILTER_SANITIZE_STRING);

$movie = file_get_contents("https://api.themoviedb.org/3/movie/" . $movie_id . "?api_key=&language=en-US");

echo json_encode($movie);

$genres = json_decode($movie)->genres;

include('database.php');

$db->addGenre($genres, $movie_id);

$link->close();

?>