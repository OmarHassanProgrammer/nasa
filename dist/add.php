<?php
$jsonFilePath = 'leaderboard.json';

$jsonFileContent = file_get_contents($jsonFilePath);

$data = json_decode($jsonFileContent, true);

if ($data === null) {
    die('Error parsing JSON file');
}

$newObject = array(
    'name' => $_GET['name'],
    'score' => $_GET['score'],
);

$data['myArray'][] = $newObject;

$updatedJson = json_encode($data, JSON_PRETTY_PRINT);

if ($updatedJson === false) {
    die('Error encoding JSON data');
}

file_put_contents($jsonFilePath, $updatedJson);

echo 'Object added successfully to the JSON file.';
?>
