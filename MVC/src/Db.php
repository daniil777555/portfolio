<?php

  namespace App;

  class Db
  {

    private $link;

    public function __construct($config)
    {
        try {
          $this->link = new \PDO(
            $config['dsn'],
            $config['user'],
            $config['pwd']
          );
        }catch (\PDOException $e) {
          die('Faild connect: ' . $e->getMessage());
        }
    }

    public function getLink(): \PDO
    {
      return $this->link;
    }

    public function checkUser($login)
    {
      try {
        return $this->link
          ->query("SELECT * FROM users_info WHERE login='$login'")
          ->fetch(\PDO::FETCH_ASSOC);
      } catch (\Throwable $e) {
        return null;
      }
    }

    public function getTableData($tableName)
    {
      try {
        return $this->link
          ->query("SELECT * FROM {$tableName}")
          ->fetchAll(\PDO::FETCH_ASSOC);
      }catch (\Throwable $e) {
        return null;
      }
    }

    public function getById($tableName, $id)
    {
      try {
        return $this->link
          ->query("SELECT * FROM {$tableName} WHERE id = " . (int)$id)
          ->fetch(\PDO::FETCH_ASSOC);
      } catch (\Throwable $e) {
        return null;
      }
    }

    public function getPicsByIds(array $ids)
    {
      if (empty($ids)) {
        return [];
      }
      $stmt = $this->link->query('SELECT * FROM img WHERE id IN (' . implode(',', $ids) . ')');
      return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getIdUser($login)
    {
      try {
        return $this->link
          ->query("SELECT id FROM users_info WHERE login='$login'")
          ->fetchColumn();
      } catch (\Throwable $e) {
        return null;
      }    
    }

    public function createOrder($userId, $status)
    {
      $this->link->exec("INSERT INTO orders SET user_id=" . (int)$userId . ", status=" . $status);
    }

    public function insertOrderedPics($orderId, $price, $count)
    {
      $this->link->exec("INSERT INTO orders_pics SET order_id=$orderId, price=" . $price . ", `count`=" . $count);
    }

    public function addNewUser($login, $pass)
    {
      $stmt = $this->link->prepare('INSERT INTO users_info SET login=:login, pass=:pass');
      $stmt->bindParam(':login', $login, \PDO::PARAM_STR);
      $stmt->bindParam(':pass', $pass, \PDO::PARAM_STR);
      $stmt->execute();
    }

    public function getPicsByCategoryId($catId)
    {
      return $this->link->query("SELECT * FROM img WHERE category_id = " . (int)$catId)
        ->fetchAll(\PDO::FETCH_ASSOC);
    }

  }
