<?php

namespace App\Controllers;


class Index extends Controller
{

    public function index()
    {
        $this->render('index.twig');
    }

    public function error()
    {
        $this->render('error.twig');
    }
}
