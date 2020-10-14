<?php 

function cmp($a, $b) {
    if ($a["clicks"] == $b["clicks"]) {
        return 0;
    }
    return ($a["clicks"] < $b["clicks"]) ? 1 : -1;
}


?>