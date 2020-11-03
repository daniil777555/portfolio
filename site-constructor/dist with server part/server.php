<?php
$data = json_decode(file_get_contents("php://input"),true);

$str = $data['str'];
$fp = fopen("newsite.html", "w");
 
fwrite($fp, $str);
 
fclose($fp);

?>