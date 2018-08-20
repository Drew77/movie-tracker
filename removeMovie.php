<?php



include("database.php");

// Not logged in, cant remove
if (!isset($_SESSION["id"])){
    echo json_encode("Not Logged in");
    $link->close();
    return;
}


$movieID = filter_var($_GET["id"], FILTER_SANITIZE_STRING);


$db->removeMovie($movieID, $_SESSION["id"]);
echo json_encode($movieID);
$link->close();

?>