<?php

namespace App\Controllers;

use \App\Models\LoginUser;

class Login extends Controller
{

  public function index()
    {
        $this->render('login.twig', ["show" => $_GET["show"]]);
    }

  public function login()
  {
    $isuser = LoginUser::in($_POST['login'], $_POST['pass']);
    if($isuser) $this->redirect("/profile");
    else $this->redirect("/login?show=true");
  }
}
