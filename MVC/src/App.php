<?php
  namespace App;

  use App\Controllers\Index;
  use \App\traits\Singleton;

  class App
  {
    use Singleton;

    private $config;
    private $db;

    public function init()
    {
      if (!headers_sent()) {
        session_start();
      }

      $this->db = new Db($this->config['db']);
    }

    public function run()
    {

      [$uri] = explode('?', $_SERVER['REQUEST_URI']);
      $router = new Router($this->config['routing']);

      if(null !== $route = $router->route($uri)){
        [$controllerName, $action, $params] = $route;
      } else{
        $controllerName = 'index';
        $action = 'index';
      }

      $controllerClass = "App\Controllers\\" . ucfirst($controllerName);
      if($action === ""){
        $action = "index";
      }
      $method = $action;


      if(class_exists($controllerClass)){
        $controller = new $controllerClass;
        if(method_exists($controller, $method)){
          $controller->$method($params);
          return;
        }
      }

      (new Index())->error();
    }

    public function getDb(): DB
    {
        return $this->db;
    }

    public function setConfig($cofig)
    {
      $this->config = $cofig;
    }

    public function getConfig()
    {
      return $this->config;
    }
  }