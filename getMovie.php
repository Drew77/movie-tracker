<?php

include("database.php");

$id = filter_var($_GET["id"], FILTER_SANITIZE_STRING);



$data = $db->getMovie($id);



$link->close();


echo json_encode($data);

?>