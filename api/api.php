<?php

/**
 * 
 * @author Patrick Shaw
 */

// Enable error reporting for debugging purposes
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include and set up the exception handler
include "config/exceptionHandler.php";
set_exception_handler("exceptionHandler");

// Autoload classes using the autoloader
include "config/autoloader.php";
spl_autoload_register("autoloader");

// Include application settings
include "config/settings.php";

// Create a new Response object to manage HTTP responses
$response = new \App\Response();

// Route the request to the endpoint controller
$endpoint = \App\Router::routeRequest();

// Retrieve data from the endpoint
$data = $endpoint->getData();

// Output the data in JSON format
$response->outputJSON($data);
