<?php

namespace App\Models;

class AddUser
{
  public static function reg($login, $pass)
  {
    $mdPass = md5($pass);
    $isuser = \App\App::getInstance()->getDb()->checkUser($login);
    
    if(!$isuser["login"]){
      \App\App::getInstance()->getDb()->addNewUser($login, $mdPass);
      setcookie("Login", $login, time()+3600 * 24 * 49, '/');
      setcookie("Pass", $mdPass, time()+3600 * 24 * 49, '/');
      return true;
    } else return false;
  }
}
