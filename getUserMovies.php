<?php

include('database.php');

    if (isset($_SESSION["id"])) {
        $usermovies = $db->getMovies($_SESSION["id"]);
        $data = array($_SESSION["id"], $usermovies);
        echo json_encode($data);       
    }
    else {
        echo json_encode("");
    }



$link->close();

?>