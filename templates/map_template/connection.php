<?php

global $wpdb;
$servername = 'localhost';
$dbname = 'krotdb';
$username = 'root';
$password = 'void445';
$mysqli = new mysqli($servername,$username,$password,$dbname);

if($mysqli->connect_error){
    exit('error ');
}
$mysqli->set_charset("utf8mb4_bin");
?>