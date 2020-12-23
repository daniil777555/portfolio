<?php

namespace App;

class Router
{
  private $config;

  public function __construct($config)
  {
    $this->config = $config;
  }

  public function route($url)
  {
    $url = self::filter($url);
    foreach($this->config as $pattern => $route){
      if(preg_match('/' . $pattern . '/u', $url, $matches)){
        array_shift($matches);
        [$controller, $action] = explode('/', $route);
        if($controller === '<controller>') {
          $controller = array_shift($matches);
        }
        if($action === '<action>'){
          $action = array_shift($matches);
        }
        if(empty($matches[count($matches) - 1])) $matches = [];

        return [$controller, $action, $matches];
      }
  }

  return null;
  }

  protected static function filter($url)
    {
      $parts = explode('/', $url);

      foreach($parts as $key => $val){
        if('' === $val) unset($parts[$key]);
      }

      return implode('/', $parts);
    }

}
