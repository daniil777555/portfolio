<?php

  namespace App\Controllers;

  use App\App;

  abstract class Controller
  {
    private $twig;

    public function __construct()
    {
        $loader = new \Twig\Loader\FilesystemLoader(App::getInstance()->getConfig()['templates']);
        $this->twig = new \Twig\Environment($loader);
    }

    protected function render($name, $data = [])
    {
        echo $this->twig->render($name, $data);
    }

    protected function redirect($url)
    {
        header('Location: ' . $url);
        exit;
    }
  }
