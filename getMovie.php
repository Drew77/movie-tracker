<?php

include("database.php");

$title = filter_var($_GET["id"], FILTER_SANITIZE_STRING);



$db->getMovie($id);

$data = (object) ['title' => $title, 
        'description' => $description,
        'released' => $released,
        'id' => $id];



$link->close();


echo json_encode($data);

?>