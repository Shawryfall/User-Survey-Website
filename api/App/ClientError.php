<?php
/**
 * @author Patrick Shaw
 */
namespace App;

class ClientError extends \Exception
{

    public function __construct($code)
    {
        parent::__construct($this->errorResponses($code));
    }

    public function errorResponses($code)
    {
        switch ($code) {
            case 404:
                http_response_code(404);
                $message = '404 Not Found';
                break;
            case 405:
                http_response_code(405);
                $message = '405 Method Not Allowed';
                break;
            case 422:
                http_response_code(422);
                $message = '422 Unprocessable Entity';
                break;
            case 401:
                http_response_code(401);
                $message = '401 Unauthorized';
                break;
            case 409:
                http_response_code(409);
                $message = '409 conflict';
                break;
            default:
                throw new \Exception('Unknown Error Code');
        }
        return $message;
    }
}