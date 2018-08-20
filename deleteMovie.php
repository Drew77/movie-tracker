<?php

include("database.php");

$id = filter_var($_GET["id"], FILTER_SANITIZE_STRING);

$data = $db->getMovie($id);
$db->deleteMovie($id);

if (mysqli_affected_rows($link)){
    echo json_encode($data);
}
else {
    echo json_encode("Fail");
}


$link->close();




?>