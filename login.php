<?php

include('database.php');

$data = json_decode(file_get_contents('php://input'));

$username = filter_var($data->username, FILTER_SANITIZE_STRING);
$password = filter_var($data->password, FILTER_SANITIZE_STRING);


$returnedUser = $db->login($username, $password);

if ($returnedUser) {
    $_SESSION["id"] = $returnedUser->id;
    $_SESSION["user"] = $returnedUser->username;
    $usermovies = $db->getMovies($returnedUser->id);
    $data = (object) ['username' => $returnedUser->username, 
        'id' => $returnedUser->id,
        'movies' => $usermovies];
    echo json_encode($data);
}
else {
    echo json_encode("0");
}

$link->close();

?>