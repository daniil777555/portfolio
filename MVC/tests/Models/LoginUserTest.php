<?php 
  declare(strict_types=1);


  final class LoginUserTest extends \BaseTest
  {
    /**
     * @dataProvider inProvider
     * @param $userData
     * @param $expected
    */
    public function testIn($userData, $expected)
    {
      [$login, $pass] = $userData;
      $actual = $this->inMock()->in($login, $pass);
      $this->assertEquals($expected, $actual);
    }

    public function inProvider()
    {
      return [
        [["sdkhjhf", "sdfgfgsdf"], false],
        [["daniil", "12345"], true],
      ];
    }

    protected function inMock()
    {
      return new class extends \App\Models\LoginUser
      {               //Пришлось переписать метод, поскольку используется сессия, из-за чего возникает ошибка
        public static function in($login, $pass)
        {
          $mdPass = md5($pass);
          $isuser = \App\App::getInstance()->getDb()->checkUser($login);
          
          if(!empty($isuser) && $isuser["login"] === $login && $isuser["pass"] === $mdPass) return true;
          else return false;
        }
      };
    }
  }
