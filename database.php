<?php
    // display errors, warnings, and notices

    include("config.php");
    
    $link = mysqli_connect($host, $user, $pw, $database);
    
    if ($link->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 

    class db
    {
        private $link;
        function __construct($link){
            $this->link = $link;
        }
        
        function getTable($table){
            $q = "SELECT * FROM $table";
            $result = $this->link->query($q);
            $output = array();
            while ($item = $result->fetch_object()){
                $output[] = $item;
            }
            return $output;
        }
        
        function getGenres($movieId){
            $q = "SELECT genres.genre FROM movie_genres INNER JOIN genres ON movie_genres.genreid = genres.id
            WHERE movie_genres.movieid = $movieId";
            $result = $this->link->query($q);
            $output = array();
            while ($item = $result->fetch_object()){
                $output[] = $item->genre;
            }
            return $output;
        }
        
        function addMovie($title, $description, $released){
            mysqli_query($this->link, "INSERT INTO Movies (title, description, release_date) VALUES ('$title', '$description', '$released')");
        }
        
        function getMovie($id){
            mysqli_query($this->link, "SELECT * FROM Movies where id =$id");
        }
        
    }
    
    $db = new db($link);

?>