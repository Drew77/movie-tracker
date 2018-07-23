<?php

include("database.php");

$title = filter_var($_POST["title"], FILTER_SANITIZE_STRING);
$description = filter_var($_POST["description"], FILTER_SANITIZE_STRING);
$released = filter_var($_POST["release_date"],  FILTER_SANITIZE_STRING);


$db->addMovie($title, $description, $released);

$data = (object) ['title' => $title, 
        'description' => $description,
        'released' => $released,
        'id' => $link->insert_id];



$link->close();


echo json_encode($data);

?>