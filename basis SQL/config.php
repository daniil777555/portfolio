<?php
const SERVER = "localhost";
const DB = "images";
const LOGIN = "root";
const PASS = "";

$connect = mysqli_connect(SERVER,LOGIN,PASS,DB)
    or die("Ошибка при подключении к базе данных");