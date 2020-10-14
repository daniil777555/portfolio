<?php
include "config.php";
  $img =  $_GET["img"];

  $count =  $_GET["count"];
  $id =  $_GET["id"];
  

  $sql = "update img set clicks=$count where id=$id;";
  $res = mysqli_query($connect,$sql);

  
?>
<img src="<?= $img?>" alt="">