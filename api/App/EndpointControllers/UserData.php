<?php
/**
 * 
 * @author Patrick Shaw
 */
namespace App\EndpointControllers;

class UserData extends Endpoint {
    public function __construct() {
        $id = $this->validateToken();
        $this->checkUserExists($id);
        
        switch (\App\Request::method()) {
            case 'GET':
                $data = $this->getUserData($id);
                break;
            case 'POST':
                $data = $this->updateUserData($id);
                break;
            case 'DELETE':
                $this->deleteUser($id);
                $data = ['message' => 'User deleted successfully'];
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

    private function getUserData($id) {
        $this->checkUserExists($id);
        $userdata = "id, username, email, age, genderID, country";
        $sql = "SELECT $userdata FROM users WHERE id = :id";
        $sqlParams = [':id' => $id];
        $dbConn = new \App\Database(SURVEY_DATABASE);
        $data = $dbConn->executeSQL($sql, $sqlParams);
        return $data;
    }

    private function updateUserData($id) {
        $this->checkUserExists($id);
        $requestData = \App\Request::params();
        $email = $requestData['email'] ?? null;
        $password = $requestData['password'] ?? null;
        $updateFields = array();
        $sqlParams = array(':id' => $id);

        if ($email !== null) {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                throw new \App\ClientError(422, "Invalid email format"); // Unprocessable Entity, incorrect email format
            }
            
            // Check if the email already exists for another user
            $dbConn = new \App\Database(SURVEY_DATABASE);
            $sqlParams = [':email' => $email, ':id' => $id];
            $sql = "SELECT * FROM users WHERE email = :email AND id != :id";
            $existingEmail = $dbConn->executeSQL($sql, $sqlParams);
            if (count($existingEmail) > 0) {
                throw new \App\ClientError(409, "Email already exists"); // Conflict, email exists
            }
            
            $updateFields[] = "email = :email";
            $sqlParams[':email'] = $email;
        }

        if ($password !== null) {
            if (strlen($password) < 8 || !preg_match('/\d/', $password) || !preg_match('/[a-zA-Z]/', $password)) {
                throw new \App\ClientError(422, "Password should be at least 8 characters long, contain at least one digit, and one letter"); // Unprocessable Entity, password not strong enough
            }
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $updateFields[] = "password = :password";
            $sqlParams[':password'] = $hashedPassword;
        }

        if (empty($updateFields)) {
            throw new \App\ClientError(400, 'No fields to update');
        }

        $updateFieldsStr = implode(", ", $updateFields);
        $sql = "UPDATE users SET $updateFieldsStr WHERE id = :id";
        $dbConn = new \App\Database(SURVEY_DATABASE);
        $dbConn->executeSQL($sql, $sqlParams);

        return ['message' => 'User data updated successfully'];
    }

    private function deleteUser($id) {
        $this->checkUserExists($id);
        $dbConn = new \App\Database(SURVEY_DATABASE);
        $sql = "DELETE FROM users WHERE id = :id";
        $sqlParams = [':id' => $id];
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