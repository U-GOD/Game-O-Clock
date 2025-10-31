<?php

$servername = "localhost";  
$username = "root";         
$password = "";             
$dbname = "gaming_event_db"; // The database


$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    echo "Database connected successfully!";
    // Remove this line after testing
}

// Set charset to UTF-8 to handle special characters
$conn->set_charset("utf8mb4");

// echo "Connected successfully";
?>