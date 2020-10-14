<?php
    include "config.php";
    include "sortArr.php";

    $sql = "select * from img";
    $res = mysqli_query($connect,$sql);
    $dirImg = Array();
    while($data = mysqli_fetch_assoc($res)){
        array_push($dirImg, $data);
    }

    uasort($dirImg, 'cmp');
    
    
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Document</title>
</head>
<body>
    <div class="container">
        <? 
            foreach($dirImg as $el):
                
        ?>
        <a onclick="counter(<?= $el['clicks']?>, <?= $el['id']?>)" href="server.php?img=<?= $el["addres"]?>" target="_blank">
            <img src="<?=$el["addres"]?>" width="<?= $el["size"]?>" alt="photo">	
            &#128065; <?= $el['clicks']?>
        </a>
        <? 
            endforeach;
        ?>

    </div>

    <script>
        async function counter(num, id){
            let count = num + 1;
            console.log("count: ", count,"id: ", id)
            let send = await fetch(`server.php?count=${count}&id=${id}`,{
                method:'GET'
            })
            window.location.reload();//без перезагрузки страницы данные о кликах не обновлялись, решил просто использовать функцию перезагрузки, чем менять всю верстку.
        }
    </script>

</body>
</html>