<?php

include('database.php');

$username = filter_var($_GET["username"], FILTER_SANITIZE_STRING);
$nameTaken = $db->checkUsername($username);


echo json_encode($nameTaken);

$link->close();

?>