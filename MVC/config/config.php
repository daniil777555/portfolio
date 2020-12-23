<?php
  return[
    "db" => [
      "dsn" => "mysql:dbname=users; host=localhost",
      "user" => "root",
      "pwd" => "dan777555",
    ],
    'templates' => __DIR__ . '/../templates',
    'routing' => [
      'galary\/([0-9]+)\/([0-9]+)' => 'galary/pic',
      'galary\/([0-9]+)' => 'galary/category',
      '(\w+)\/(\w+)\/(.*)' => '<controller>/<action>',
      '(\w+)\/(\w+)' => '<controller>/<action>',
      '(\w+)([\/.]*)' => '<controller>/index',
      '^$' => 'index/index',
      '(.*)' => 'index/error',
    ],
  ]; 