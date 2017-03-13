#!/usr/bin/env babel-node
"use strict";


// A better router to create a handler for all routes
import Router from "./router";
var router = new Router();

var http = require("http");
var url = require("url");
import fs from 'fs';
import {searchForRoom, serchForHouse, searchByString, searchByStringEnhanced} from './handler';


// Reads the JSON file
const JSONfile = JSON.parse(fs.readFileSync('../salar.json', "utf8"));


/**
 * Wrapper function for sending a JSON response
 *
 * @param  Object        res     The response
 * @param  Object/String content What should be written to the response
 * @param  Integer       code    HTTP status code
 */
function sendJSONResponse(res, content, code = 200) {
    res.writeHead(code, "Content-Type: application/json");
    res.write(JSON.stringify(content, null, "    "));
    res.end();
}



/**
 * Checks if max is set
 *
 * @param  Object        req     The request
 */
function maxIsSet(req) {
    let max = parseInt(req.query.max);
    if (max !== undefined && Number.isInteger(max)) {
        return true;
    }
    return false;
}


/**
 * Display a helptext about the API.
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/", (req, res) => {

    res.writeHead(200, "Content-Type: text/plain");
    res.write("Välkommen till bth-appen server. Här ser du API beskrivningen.\т" +
        " /                             Visa en lista av de routes som stöds.\n" +
        " /room/list                    Visa samtliga salar.\n" +
        " /room/view/id/:number         Visa detaljer om salen med valt salsnummer.\n" +
        " /room/view/house/:house       Visa samtliga salar som finns i ett visst hus.\n" +
        " /room/search/:search          Visa de salar som matchar söksträngen. Sökning skall ske på delsträng i samtliga fält.\n"
    );
    res.end();
});



/**
 * Sends back JSON obj
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/list", (req, res) => {
    // Send the response
    if (maxIsSet(req)) {
        let max = parseInt(req.query.max);
        sendJSONResponse(res, JSONfile.salar.slice(0, max));
    } else {
        sendJSONResponse(res, JSONfile);
    }
});



/**
 * Search for room by roomnr
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/view/id/:number", (req, res) => {

    let salsnr = req.params.number;
    let result = searchForRoom(salsnr, JSONfile);

    sendJSONResponse(res, result);
});



/**
 * View the gameboard as ascii.
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/view/house/:house", (req, res) => {

    let house = req.params.house;
    let result = serchForHouse(house, JSONfile);

    if (maxIsSet(req)) {
        let max = parseInt(req.query.max);
        sendJSONResponse(res, result.slice(0, max));
    } else {
        sendJSONResponse(res, result);
    }
});



/**
 * Search for a string
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/search/:search", (req, res) => {

    let search = req.params.search;
    let result = searchByString(search, JSONfile);

    if (maxIsSet(req)) {
        let max = parseInt(req.query.max);
        sendJSONResponse(res, result.slice(0, max));
    } else {
        sendJSONResponse(res, result);
    }
});

/**
 * Search for a string
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/searchp/:search", (req, res) => {

    let search = req.params.search;
    let result = searchByStringEnhanced(search, JSONfile);

    if (maxIsSet(req)) {
        let max = parseInt(req.query.max);
        sendJSONResponse(res, result.slice(0, max));
    } else {
        sendJSONResponse(res, result);
    }
});

/**
 * Create and export the server
 */
var server = http.createServer((req, res) => {
    var ipAddress,
        route;

    // Log incoming requests
    ipAddress = req.connection.remoteAddress;

    // Check what route is requested
    route = url.parse(req.url).pathname;
    console.log("Incoming route " + route + " from ip " + ipAddress);

    if (server.develop) {
        console.log(res);
    }

    // Let the router take care of all requests
    router.route(req, res);
});

export default server;
