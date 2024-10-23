<?php
/**
 * @author Patrick Shaw
 */
namespace App\EndpointControllers;

class AllUserSurvey extends Endpoint
{
    protected $allowedParams = ["limit", "q1", "q2", "q4", "q5", "q6", "q7", "genderID", "age"];

    private $sql = "SELECT survey.*, users.genderID, users.age FROM survey INNER JOIN users ON survey.userid = users.id";
    private $sqlParams = [];

    public function __construct()
    {
        switch (\App\Request::method()) {
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
        $whereConditions = [];

        if (isset(\App\Request::params()['limit'])) {
            if (!is_numeric(\App\Request::params()['limit'])) {
                throw new \App\ClientError(422);
            }
            $limit = (int)\App\Request::params()['limit'];
            $this->sql .= " LIMIT :limit";
            $this->sqlParams[':limit'] = $limit;
        }

        if (isset(\App\Request::params()['q1'])) {
            $q1 = \App\Request::params()['q1'];
            $allowedValues = ['accountant', 'computing', 'quantity_surveyor', 'other'];
            if (!in_array($q1, $allowedValues)) {
                throw new \App\ClientError(422);
            }
            $whereConditions[] = "survey.q1 = :q1";
            $this->sqlParams[':q1'] = $q1;
        }

        foreach (['q2', 'q4', 'q5', 'q6', 'q7'] as $question) {
            if (isset(\App\Request::params()[$question])) {
                $value = \App\Request::params()[$question];
                $allowedValues = [1, 2, 3, 4, 5];
                if (!in_array($value, $allowedValues)) {
                    throw new \App\ClientError(422);
                }
                $whereConditions[] = "survey.$question = :$question";
                $this->sqlParams[":$question"] = $value;
            }
        }

        if (isset(\App\Request::params()['genderID'])) {
            $genderID = \App\Request::params()['genderID'];
            $allowedValues = [1, 2, 3];
            if (!in_array($genderID, $allowedValues)) {
                throw new \App\ClientError(422);
            }
            $whereConditions[] = "users.genderID = :genderID";
            $this->sqlParams[':genderID'] = $genderID;
        }

        if (isset(\App\Request::params()['age'])) {
            $age = \App\Request::params()['age'];
            $allowedRanges = [
                'under18' => 'users.age < 18',
                '18-29' => 'users.age BETWEEN 18 AND 29',
                '30-44' => 'users.age BETWEEN 30 AND 44',
                '45-59' => 'users.age BETWEEN 45 AND 59',
                '60above' => 'users.age >= 60',
            ];
            if (!isset($allowedRanges[$age])) {
                throw new \App\ClientError(422);
            }
            $whereConditions[] = $allowedRanges[$age];
        }

        if (!empty($whereConditions)) {
            $this->sql .= " WHERE " . implode(" AND ", $whereConditions);
        }
    }
}