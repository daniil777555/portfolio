<?php

namespace App\Controllers;

use App\Models\Images;

class Galary extends Controller
{
  public function index()
  {
    $this->render('galary.twig', [
      'categories' => Images::getAllCat(),
    ]);
  }

  public function category($params = [])
  {
    $id = array_shift($params);
    if(!$id){
      $this->render("category.twig", [
        "images" => \App\App::getInstance()->getDb()->getTableData("img"),
      ]);
    } else{
      $this->render("category.twig", [
        "id" => $id,
        "title" => Images::getCategoryTitle($id),
        "images" => Images::getPics($id),
      ]);
    }
  }

  public function pic($params)
    {
      [$catId, $id] = $params;
      $this->render('pic.twig', [
        'cat' => [
          'id' => $catId,
          'title' => Images::getCategoryTitle($catId),
        ],
        'pic' => Images::getPic($id),
      ]);
    }

}
