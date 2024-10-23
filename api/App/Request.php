<?php
/**
 * 
 * @author Patrick Shaw
 */
namespace App;

abstract class Request
{
    public static function method()
    {
        return $_SERVER['REQUEST_METHOD'];
    }

    public static function endpointName()
    {
        $url = $_SERVER["REQUEST_URI"];
        $path = parse_url($url)['path'];
        return str_replace(BASEPATH, "", $path);
    }

    public static function params()
    {
        $method = self::method();
        $contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';

        if ($method === 'POST' && stristr($contentType, 'application/json') !== false) {
            $rawBody = file_get_contents('php://input');
            $jsonData = json_decode($rawBody, true);

            if (json_last_error() === JSON_ERROR_NONE) {
                return $jsonData;
            }
        }

        return $_REQUEST;
    }

    public static function getBearerToken()
    {
        $allHeaders = getallheaders();
        $authorizationHeader = "";

        if (array_key_exists('Authorization', $allHeaders)) {
            $authorizationHeader = $allHeaders['Authorization'];
        } elseif (array_key_exists('authorization', $allHeaders)) {
            $authorizationHeader = $allHeaders['authorization'];
        }

        if (substr($authorizationHeader, 0, 7) != 'Bearer ') {
            throw new ClientError(401);
        }

        return trim(substr($authorizationHeader, 7));
    }
}