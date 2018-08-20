<?php



include("database.php");

// Not logged in, cant add
if (!isset($_SESSION["id"])){
    echo json_encode($_SESSION);
    return;
}

$data = json_decode(file_get_contents('php://input'));

$movieID = filter_var($data->movieID, FILTER_SANITIZE_STRING);
$day = filter_var($data->day, FILTER_SANITIZE_STRING);
$year = filter_var($data->year, FILTER_SANITIZE_STRING);
$month = filter_var($data->month, FILTER_SANITIZE_STRING);
$rating = filter_var($data->rating, FILTER_SANITIZE_STRING);

$dateString = $year . "-" . $month . "-" . $day;

if ($db->getMovie($movieID, $_SESSION["id"])){
    echo json_encode("seen");
}
else {
    $db->addMovie($_SESSION["id"], $movieID, $dateString, $rating);
    $added = mysqli_insert_id($link);
    
    
    if ($added > 0) {
        $movie = $db->getMovie($movieID, $_SESSION["id"]);
        $returnObject = (Object) ["date_seen" => $dateString, "movie" => $movie, "rating" => $rating];
        echo json_encode($returnObject);
    }
    else {
        echo json_encode("0");
    }
}
$link->close();

?>