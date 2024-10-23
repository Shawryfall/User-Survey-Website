<?php
/**
 * @author Patrick Shaw
 */
namespace App\EndpointControllers;

class Preview extends Endpoint
{

    protected $allowedParams = ["limit"];

    private $sql = "SELECT q3
                    FROM survey
                    WHERE q3 IS NOT NULL
                    ORDER BY RANDOM()";

    private $sqlParams = [];

    public function __construct()
    {
        switch(\App\Request::method()) {
            case 'GET':
                $this->checkAllowedParams();
                $this->buildSQL();
                $dbConn = new \App\Database(SURVEY_DATABASE);
                $data = $dbConn->executeSQL($this->sql, $this->sqlParams);
                break;
            default:
                throw new \App\ClientError(405);
        }
        
        parent::__construct($data);
    }

    private function buildSQL()
    {
        if (isset(\App\Request::params()['limit']))
        {
            if (!is_numeric(\App\Request::params()['limit'])) {
                throw new \App\ClientError(422);
            }
            $limit = (int)\App\Request::params()['limit'];
            $this->sql .= " LIMIT :limit";
            $this->sqlParams[':limit'] = $limit;
        }
    }
}
