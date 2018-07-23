<?php

$output = [];

$myfile = fopen("movies.txt", "r") or die("Unable to open file!");
// Output one line until end-of-file
while(!feof($myfile)) {
  $output[] = substr ( fgets($myfile), 5, -1);
}
fclose($myfile);

echo json_encode($output);
?>