#!/usr/bin/env babel-node

/**
 * Main program to run the Gomoku server
 *
 */
"use strict";

const VERSION = "1.0.0";

// For CLI usage
import path from 'path';
var scriptName = path.basename(process.argv[1]);
var args = process.argv.slice(2);
var arg;

var port = process.env.LINUX_PORT || 1337;
var host = process.env.LINUX_SERVER || "http://localhost";

// Get the server with defaults
import clientClass from "./client.js";

var client = new clientClass();

// Make it using prompt
var readline = require("readline");

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



/**
 * Display helptext about usage of this script.
 */
function usage() {
    console.log(`Usage: ${scriptName} [options]

Options:
 -h               Display help text.
 -v               Display the version.
 --server <url>   Set the server url to use.
 --port <number>  Set the port to use.
 `);
}

/**
 * Display helptext about bad usage.
 *
 * @param String message to display.
 */
function badUsage(message) {
    console.log(`${message}
Use -h to get an overview of the command.`);
}



/**
 * Display version.
 */
function version() {
    console.log(VERSION);
}



// Walkthrough all arguments checking for options.
while ((arg = args.shift()) !== undefined) {
    console.log(arg);
    switch (arg) {
        case "-h":
            usage();
            process.exit(0);
            break;

        case "-v":
            version();
            process.exit(0);
            break;

        case "--server":
            host = args.shift();
            if (host === undefined) {
                badUsage("--server must be followed by a url.");
                process.exit(1);
            }
            break;

        case "--port":
            port = args.shift();
            if (port === undefined) {
                badUsage("--port must be followed by portnr.");
                process.exit(1);
            }
            break;

        default:
            badUsage("Unknown argument.");
            process.exit(1);
            break;
    }
}




/**
 * Display a menu.
 */
function menu() {
    console.log(`
        Commands available:
 exit                       Leave this program.
 menu                       Print this menu.
 url                        Get url to view the server in browser.
 list                       List all rooms.
 view <id>                  View the room with the selected id.
 house <house>              View the names of all rooms in this building (house).
 search <string>            View the details of all matching rooms (one per row).
 `);
}



/**
 * Callbacks for BTH-app.
 */
rl.on("line", function(line) {
    // Split incoming line with arguments into an array
    var args = line.trim().split(" ");
    args = args.filter(value => {
        return value !== "";
    });

    switch (args[0]) {
        case "exit":
            console.log("Bye!");
            process.exit(0);
            break;

        case "menu":
            menu();
            rl.prompt();
            break;

        case "url":
            console.log("Click this url to view the server in a browser.\n" + server + "/");
            rl.prompt();
            break;

        case "list":
            client.listAll();
            break;

        case "view":
            client.listById(args[1]);
            break;

        case "house":
            client.listByHouse(args[1]);
            break;

        case "search":
            client.listBySearch(args[1]);
            break;

        default:
            console.log("Enter 'menu' to get an overview of what you can do here.");
            rl.prompt();
    }
});



rl.on("close", function() {
    console.log("Bye!");
    process.exit(0);
});

var server = `${host}:${port}`;

// Main
client.setServer(server);
console.log("Use -h to get a list of options to start this program.");
console.log("Ready to talk to server url '" + server + "'.");
console.log("Use 'menu' to get a list of commands.");
rl.setPrompt("BTH-app$ ");
rl.prompt();
