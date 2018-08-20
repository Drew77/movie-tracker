<?php

include('database.php');

$movies = $db->getTable('Movies');

echo json_encode($movies);

$link->close();

?>