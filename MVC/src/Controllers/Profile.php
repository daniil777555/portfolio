<?php

namespace App\Controllers;


class Profile extends Controller
{
  public function index()
  {
    $this->render('profile.twig', ["name" => $_COOKIE["Login"]]);
  }
}
