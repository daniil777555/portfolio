<?php 
  declare(strict_types=1);


  final class RouterTest extends \BaseTest
  {
    /**
     * @dataProvider routeProvider
     * @param $url
     * @param $expected
    */
    public function testRoute($url, $expected)
    {
      $router = new \App\Router(self::getConfig()['routing']);
      $actual = $router->route($url);
      $this->assertEquals($expected, $actual);
    }

    public function routeProvider()
    {
      return [
        ['/asd//qwe//', ['asd', 'qwe', []]],
        ['', ['index', 'index', []]],
        ['logout', ['logout', 'index', []]],
        ['galary/123', ['galary', 'category', ['123']]],
        ['galary/123/234', ['galary', 'pic', ['123', '234']]],
        ['pages/this_is_good_page/and_subpage', ['pages', 'this_is_good_page', ['and_subpage']]],
      ];
    }

    /**
     * @dataProvider filterProvider
     * @param $url
     * @param $expected
    */
    public function testFilter($url, $expected)
    {
      $actual = $this->RouterMock()->getFilterData($url);
      
      $this->assertEquals($expected, $actual);
    }

    public function filterProvider()
    {
      return [
        ['/', ''],
        ['/afv', 'afv'],
        ['//dfgdf/sdf', 'dfgdf/sdf'],
        ['', ''],
      ];
    }

    protected function RouterMock()
    {
      return new class extends \App\Router
      {

        public function __construct()
        {

        }
        public function getFilterData($url)
        {
          return $filtered  = $this->filter($url);
        }
      };
    }
  }