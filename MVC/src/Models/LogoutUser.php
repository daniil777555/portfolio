<?php

namespace App\Models;

class LogoutUser
{
  public static function out()
  {
    setcookie("Login", "", time()-3600 * 24 * 49, '/');
    setcookie("Pass", "", time()-3600 * 24 * 49, '/');
  }
}
