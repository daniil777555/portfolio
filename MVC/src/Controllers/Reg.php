<?php

namespace App\Controllers;

use \App\Models\AddUser;

class Reg extends Controller
{

  public function index($show = false)
    {
        $this->render('reg.twig', ["show" => $_GET["show"]]);
    }

  public function registr()
  {
    $isuser = AddUser::reg($_POST['login'], $_POST['pass']);
    if($isuser) $this->redirect("/profile");
    else $this->redirect("/reg?show=true");
  }
}
