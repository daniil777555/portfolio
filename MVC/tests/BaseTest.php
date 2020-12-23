<?php
use PHPUnit\Framework\TestCase;
abstract class BaseTest extends TestCase
{

  public static function setUpBeforeClass(): void
  {
    $config = require __DIR__ . '/../config/config.php';
    \App\App::getInstance()->setConfig($config);
    \App\App::getInstance()->init();
  }

  public static function getConfig(){ 
    return require __DIR__ . '/../config/config.php';
  }
}
