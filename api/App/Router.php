<?php
/**
 * 
 * @author Patrick Shaw
 */
namespace App;

abstract class Router
{

    public static function routeRequest()
    {
        try {
            switch (Request::endpointName()) {
                case '/':
                case '/developer':
                case '/developer/':
                    $endpoint = new \App\EndpointControllers\Developer();
                    break;
                case '/token':
                case '/token/':
                    $endpoint = new \App\EndpointControllers\Token();
                    break;
                case '/userdata':
                case '/userdata/':
                    $endpoint = new \App\EndpointControllers\UserData();
                    break;
                case '/createaccount':
                case '/createaccount/':
                    $endpoint = new \App\EndpointControllers\CreateAccount();
                    break;
                case '/country':
                case '/country/':
                    $endpoint = new \App\EndpointControllers\Country();
                    break;  
                case '/specificusersurvey':
                case '/specificusersurvey/':
                    $endpoint = new \App\EndpointControllers\SpecificUserSurvey();
                    break;  
                case '/allusersurvey':
                case '/allusersurvey/':
                    $endpoint = new \App\EndpointControllers\AllUserSurvey();
                    break;  
                case '/preview':
                case '/preview/':
                    $endpoint = new \App\EndpointControllers\Preview();
                    break;
                default:
                    throw new ClientError(404);
            }
        } catch (ClientError $e) {
            $data['message'] = $e->getmessage();
            $endpoint = new \App\EndpointControllers\Endpoint([$data]);
        }
        return $endpoint;
    }
}
