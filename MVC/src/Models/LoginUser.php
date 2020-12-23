<?php

namespace App\Models;

class LoginUser
{
  public static function in($login, $pass)
  {
    $mdPass = md5($pass);
    $isuser = \App\App::getInstance()->getDb()->checkUser($login);
    
    if(!empty($isuser) && $isuser["login"] === $login && $isuser["pass"] === $mdPass){
      setcookie("Login", $login, time()+3600 * 24 * 49, '/');
      setcookie("Pass", $mdPass, time()+3600 * 24 * 49, '/');
      return true;
    } else return false;
  }
}
