<?php

namespace App\Controllers;


class Order extends Controller
{
  const STATUS_NEW = 1;
  const STATUS_DELIVERY = 2;
  const STATUS_DONE = 3;
  const STATUS_REJECTED = 4;

  public function index()
  {
    if(isset($_COOKIE["Login"], $_COOKIE["Pass"])){
      if(empty($_SESSION["basket"])) $this->redirect("/galary");


      $userId =  \App\App::getInstance()->getDb()->getIdUser($_COOKIE['Login']);

      \App\App::getInstance()->getDb()->createOrder($userId, self::STATUS_NEW);
        
      $orderId = \App\App::getInstance()->getDb()->getLink()->lastInsertId();

      $ids = array_keys($_SESSION["basket"]);
      $pics = \App\App::getInstance()->getDb()->getPicsByIds($ids);

      foreach($pics as $key => $val){
        \App\App::getInstance()->getDb()->insertOrderedPics($orderId, $val['price'], $_SESSION["basket"][$val['id']]);
      }

      $_SESSION["basket"] = [];
      $this->redirect("/basket?stateOrder=true");
      
    } else $this->redirect("/login");
  }
}
