<?php
/**
 * 
 * @author Patrick Shaw
 */
function autoloader($className) {
    $filename = $className . ".php";
    $filename = str_replace('\\', DIRECTORY_SEPARATOR, $filename);
    if (is_readable($filename)) {
        include_once $filename;
    } else {
        throw new Exception("File Not Found: " . $filename);
    }
}