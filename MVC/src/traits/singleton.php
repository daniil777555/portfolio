<?php
    namespace App\traits;

    trait Singleton
    {
        private static $instance;

        public static function getInstance():self
        {
            if(self::$instance === null){
                self::$instance = new self();
            }

            return self::$instance;
        }

        private function __construct()
        {
        }

        private function __wakeup()
        {
        }

        private function __clone()
        {
        }
    }