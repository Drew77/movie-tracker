<?php

include('database.php');

$data = json_decode(file_get_contents('php://input'));

$username = filter_var($data->username, FILTER_SANITIZE_STRING);
$password = filter_var($data->password, FILTER_SANITIZE_STRING);
$confirmPassword = filter_var($data->passwordConfirm, FILTER_SANITIZE_STRING);

if ($password != $confirmPassword){
    echo json_encode("Passwords do not match");
}
else {
    $db->addUser($username, password_hash($password, PASSWORD_DEFAULT));
    if (mysqli_insert_id($link) > 0){
        $_SESSION["id"] = mysqli_insert_id($link);
        $_SESSION["user"] = $username;
        echo json_encode($username);
    }
    
}



$link->close();

?>