/**
 * Front for BTH-app server
 */

// Import the http server as base
import http from 'http';



/**
 * Class for BTH-app
 *
 */
class BTHapp {

    constructor(verbose) {
        this.verbose = verbose;
    }



    /**
     * Set the url of the server to connect to.
     *
     * @param  String url to use to connect to the server.
     *
     */
    setServer(url) {
        this.server = url;
    }



    listAll() {
        this.httpGet("/room/list")
        .then(data => {
            console.log(data);
        });
    }

    listByHouse(house) {
        this.httpGet("/room/view/house/" + house)
        .then(data => {
            console.log(data);
        });
    }

    listById(id) {
        this.httpGet("/room/view/id/" + id)
        .then(data => {
            console.log(data);
        });
    }

    listBySearch(searchstr) {
        this.httpGet("/room/search/" + searchstr)
        .then(data => {
            console.log(data);
        });
    }

    listBySearchEnhanced(searchstr) {
        this.httpGet("/room/searchp/" + searchstr)
        .then(data => {
            console.log(data);
        });
    }



    /**
     * Make a HTTP GET request, wrapped in a Promise.
     *
     * @param  String url to connect to.
     *
     * @return Promise
     *
     */
    httpGet(url) {
        return new Promise((resolve, reject) => {
            http.get(this.server + url, (res) => {
                var data = "";

                if (this.verbose) {
                    console.log("Url is: " + url);
                }

                res.on('data', (chunk) => {
                    data += chunk;
                }).on('end', () => {
                    if (res.statusCode === 200) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                }).on('error', (e) => {
                    reject("Got error: " + e.message);
                });
            });
        });
    }
}

export default BTHapp;
