<?php 
  declare(strict_types=1);
  use PHPUnit\Framework\TestCase;

  final class AppTest extends TestCase
  {
    public function testGetCofig()
    {
      $expected = [
        "db" => [
          "dsn" => "mysql:dbname=users; host=localhost",
          "user" => "root",
          "pwd" => "dan777555",
        ],
        'templates' => __DIR__ . '/../templates',
        'routing' => [
          'galary\/([0-9]+)\/([0-9]+)' => 'galary/pic',
          'galary\/([0-9]+)' => 'galary/category',
          '(\w+)\/(\w+)' => '<controller>/<action>',
          '(\w+)([\/.]*)' => '<controller>/index',
          '^$' => 'index/index',
          '(.*)' => 'index/error',
        ],
      ];
      \App\App::getInstance()->setConfig($expected);
      $actual = \App\App::getInstance()->getConfig();
      $this->assertEquals($expected, $actual);
    }  
  }
  