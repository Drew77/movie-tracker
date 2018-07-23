<?php 

    $link = mysqli_connect('127.0.0.1', 'amail','', 'moviedb');
    
    if ($link->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 
    
?>