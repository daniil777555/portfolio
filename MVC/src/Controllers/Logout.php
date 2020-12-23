<?php

namespace App\Controllers;

use App\Models\LogoutUser;

class Logout extends Controller
{
  public function index()
  {
    LogoutUser::out();
    \App\Controllers\Basket::cleanBasket();
    $this->redirect("/");
  }
}
