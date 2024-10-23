<?php
/**
 * 
 * @author Patrick Shaw
 */
namespace App\EndpointControllers;

class Country extends Endpoint
{
    
    protected $allowedParams = [];
  
    private $sql = "SELECT country FROM country";

    private $sqlParams = [];

    public function __construct()
    {
        switch(\App\Request::method()) {
            case 'GET':
                $this->checkAllowedParams();
                $dbConn = new \App\Database(SURVEY_DATABASE);
                $data = $dbConn->executeSQL($this->sql, $this->sqlParams);
                break;
            default:
                throw new \App\ClientError(405);
        }
        
        parent::__construct($data);
    }
}
