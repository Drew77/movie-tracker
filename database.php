<?php
    // display errors, warnings, and notices

    include("config.php");
    
    $link = mysqli_connect($host, $user, $pw, $database);
    
    if ($link->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 

    class movie {
        public $id;
        public $title;
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
        
        function checkUsername($username){
            $q = mysqli_query($this->link, "SELECT * FROM users WHERE username= '$username'");
            return mysqli_num_rows($q);
        }
    
        function setPoster($id, $poster, $released){
            mysqli_query($this->link, "UPDATE Movies SET Poster = '$poster', Released = '$released' WHERE id=$id");
        }
        function addUser($username, $password){
            mysqli_query($this->link, "INSERT into users (username, password) VALUES ('$username', '$password')");
        }
        function login($username, $password){
            $q = mysqli_query($this->link, "SELECT id, username, password from users WHERE username = '$username'");
            $returnedUser = mysqli_fetch_object($q);
            if ($returnedUser and password_verify ($password , $returnedUser->password)){
                return $returnedUser;
            }
            else {
                return false;
            }

        }
        // Seen a movie
        function addMovie($userID, $movieID, $date, $rating){
            mysqli_query($this->link, "INSERT INTO seenmovies (userID, movieId, date_seen, rating)
                                        VALUES ('$userID', '$movieID', '$date', '$rating')");
        }
        
        function getMovie($movieid, $userid){
            $q =  mysqli_query($this->link, "SELECT * FROM Movies INNER JOIN seenmovies ON Movies.movieID = seenmovies.MovieID 
            WHERE Movies.movieID='$movieid' AND userId='$userid'");
            return  mysqli_fetch_object($q, "movie");
        }
        function getMovies($id){
            $q =  mysqli_query($this->link, "SELECT * FROM seenmovies
            INNER JOIN Movies ON seenmovies.movieID=Movies.movieID
            where userID ='$id'
            ORDER BY seenmovies.date_seen DESC");
            $movies = [];
            //INNER JOIN genres on genres.genreID=movie_genres.genreID
            while ($movie = mysqli_fetch_object($q)) {
                $movies[] = $movie;
            }
            return $movies;
        }       
        function deleteMovie($id){
            mysqli_query($this->link, "DELETE FROM Movies WHERE id=$id");
        }
        function removeMovie($movieid, $userid){
             mysqli_query($this->link, "DELETE FROM seenmovies WHERE movieID = '$movieid' and userID = '$userid'");
        }
        
        function addGenre($genres, $movieID){
            
            // check if movies genres are already saved
            $q = mysqli_query($this->link, "SELECT * FROM movie_genres WHERE movieID = '$movieID'");
            if (mysqli_num_rows($q)){
                return;
            }
            // else save them
            else {
                $insert_statement = "";
                foreach ($genres as $genre){
                    $insert_statement .= "($genre->id, $movieID),";
                }
                $insert_statement = substr($insert_statement, 0, -1);
                mysqli_query($this->link, "INSERT INTO movie_genres (genreID, movieID) VALUES $insert_statement");               
            }

        }
        
    }
    
    $db = new db($link);

?>