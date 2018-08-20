<?php

include('database.php');

session_unset();

echo json_encode("1");

$link->close();

?>