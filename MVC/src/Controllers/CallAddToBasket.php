<?php

namespace App\Controllers;


class CallAddToBasket extends Controller
{
  public function index()
  {
    $id = file_get_contents("php://input");
    \App\Controllers\Basket::add2Basket($id);
  }
}
