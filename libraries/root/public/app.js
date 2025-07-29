import Listener from "devlien/listener";
import config from "devlien/config";

/*
* *************************************************************
* If the specified port is already in use, 
* it will automatically try the next available port.
* Start the HTTP server on the port defined in 
* the configuration.
* ****************************************
*/ 
Listener.active(config('app.port'));