<?php

// include("database.php");
// $moviesJson = file_get_contents('movies.json');


// $movies = json_decode($moviesJson);

// foreach ($movies as $movie){
//         $db->addMovie($movie->title, $movie->movieId);
// }

// $link->close();


// echo json_encode($moviesJson);

include("database.php");

$movies = $db->getTable("Movies");
for ($i = 2000; $i < 2100; $i++){
    $id = $movies[$i]->movieID;
    $movieJson = file_get_contents("https://api.themoviedb.org/3/movie/$id?api_key=&language=en-US");
    $movie = json_decode($movieJson);
    $poster = $movie->poster_path;
    $released = $movie->release_date;
    $db->setPoster($movies[$i]->id, $poster, $released);
}

$count = mysqli_affected_rows ( $link );

$link->close();

echo json_encode($count);


?>