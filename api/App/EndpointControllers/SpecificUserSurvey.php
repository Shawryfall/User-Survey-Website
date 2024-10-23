<?php
/**
 * @author Patrick Shaw
 */
namespace App\EndpointControllers;

class SpecificUserSurvey extends Endpoint {
    public function __construct() {
        $userId = $this->validateToken();
        $this->checkUserExists($userId);

        switch (\App\Request::method()) {
            case 'GET':
                $data = $this->getSurveyData($userId);
                break;
            case 'POST':
                $this->createSurveyData($userId);
                $data = ['message' => 'Survey data created successfully'];
                break;
            case 'DELETE':
                $this->deleteSurveyData($userId);
                $data = ['message' => 'Survey data deleted successfully'];
                break;
            default:
                throw new \App\ClientError(405);
                break;
        }
        parent::__construct($data);
    }

    private function validateToken() {
        $secretkey = SECRET;
        $jwt = \App\Request::getBearerToken();
        try {
            $decodedJWT = \FIREBASE\JWT\JWT::decode($jwt, new \FIREBASE\JWT\Key($secretkey, 'HS256'));
        } catch (\Exception $e) {
            throw new \App\ClientError(401);
        }
        if (!isset($decodedJWT->exp) || !isset($decodedJWT->sub)) {
            throw new \App\ClientError(401);
        }
        return $decodedJWT->sub;
    }

    private function getSurveyData($userId) {
        $surveydata = "id, userid, q1, q2, q3, q4, q5, q6, q7";
        $sql = "SELECT $surveydata FROM survey WHERE userid = :userid";
        $sqlParams = [':userid' => $userId];
        $dbConn = new \App\Database(SURVEY_DATABASE);
        $data = $dbConn->executeSQL($sql, $sqlParams);
        return $data;
    }

    private function createSurveyData($userId) {
        $requestData = \App\Request::params();
        $q1 = $requestData['q1'] ?? null;
        $q2 = $requestData['q2'] ?? null;
        $q3 = $requestData['q3'] ?? null;
        $q4 = $requestData['q4'] ?? null;
        $q5 = $requestData['q5'] ?? null;
        $q6 = $requestData['q6'] ?? null;
        $q7 = $requestData['q7'] ?? null;
    
        // Validate q1
        $allowedQ1Values = ['accountant', 'computing', 'quantity surveyor', 'other'];
        if ($q1 === null || !in_array(strtolower($q1), $allowedQ1Values)) {
            throw new \App\ClientError(422, 'Invalid value for q1. Allowed values: ' . implode(', ', $allowedQ1Values));
        }
    
        // Validate q2, q4, q5, q6, q7
        $allowedValues = [1, 2, 3, 4, 5];
        foreach (['q2', 'q4', 'q5', 'q6', 'q7'] as $question) {
            $value = $$question;
            if ($value === null || !in_array($value, $allowedValues)) {
                throw new \App\ClientError(422, "Invalid value for $question. Allowed values: " . implode(', ', $allowedValues));
            }
        }
    
        // Validate q3
        if ($q3 !== null && strlen($q3) > 200) {
            throw new \App\ClientError(422, 'q3 cannot exceed 200 characters');
        }
    
        $dbConn = new \App\Database(SURVEY_DATABASE);
    
        // Check if a survey already exists for the user
        $selectSql = "SELECT id FROM survey WHERE userid = :userid";
        $selectParams = [':userid' => $userId];
        $existingSurvey = $dbConn->executeSQL($selectSql, $selectParams);
    
        if (count($existingSurvey) > 0) {
            // Update the existing survey
            $updateSql = "UPDATE survey SET q1 = :q1, q2 = :q2, q3 = :q3, q4 = :q4, q5 = :q5, q6 = :q6, q7 = :q7 WHERE userid = :userid";
            $updateParams = [
                ':userid' => $userId,
                ':q1' => $q1,
                ':q2' => $q2,
                ':q3' => $q3,
                ':q4' => $q4,
                ':q5' => $q5,
                ':q6' => $q6,
                ':q7' => $q7
            ];
            $dbConn->executeSQL($updateSql, $updateParams);
        } else {
            // Insert a new survey
            $insertSql = "INSERT INTO survey (userid, q1, q2, q3, q4, q5, q6, q7) VALUES (:userid, :q1, :q2, :q3, :q4, :q5, :q6, :q7)";
            $insertParams = [
                ':userid' => $userId,
                ':q1' => $q1,
                ':q2' => $q2,
                ':q3' => $q3,
                ':q4' => $q4,
                ':q5' => $q5,
                ':q6' => $q6,
                ':q7' => $q7
            ];
            $dbConn->executeSQL($insertSql, $insertParams);
        }
    }

    private function deleteSurveyData($userId) {
        $dbConn = new \App\Database(SURVEY_DATABASE);
        $sql = "DELETE FROM survey WHERE userid = :userid";
        $sqlParams = [':userid' => $userId];
        $dbConn->executeSQL($sql, $sqlParams);
    }

    private function checkUserExists($id) {
        $dbConn = new \App\Database(SURVEY_DATABASE);
        $sql = "SELECT id FROM users WHERE id = :id";
        $sqlParams = [':id' => $id];
        $data = $dbConn->executeSQL($sql, $sqlParams);
        if (count($data) != 1) {
            throw new \App\ClientError(401);
        }
    }
}