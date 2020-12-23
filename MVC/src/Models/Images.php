<?php

namespace App\Models;

class Images
{
  public static function getAllPic(){
    return \App\App::getInstance()->getDb()->getTableData("img");
  }

  public static function getAllCat(){
    return \App\App::getInstance()->getDb()->getTableData("categories");
  }

  public static function getCategoryTitle($id)
  {
    $data = \App\App::getInstance()->getDb()->getById("categories", $id);
    if ($data) {
      return $data['category'];
    }
    return null;
  }

  public static function getPics($catId)
  {
    return \App\App::getInstance()->getDb()->getPicsByCategoryId($catId);
  }

  public static function getPic($id)
  {
    return \App\App::getInstance()->getDb()->getById("img", $id);
  }

}
