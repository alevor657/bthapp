"use strict";

/**
 * Search by roomnumber
 *
 * @param String str searchstring
 * @param Object JSONfile
 */
export function searchForRoom(str, JSONfile) {
    let result = JSONfile.salar.filter((item) => {
        return item.Salsnr === str;
    });
    return result;
}

/**
 * Search by house
 *
 * @param String str searchstring
 * @param Object JSONfile
 */
export function serchForHouse(house, JSONfile) {
    let result = JSONfile.salar.filter((item) => {
        return item.Hus === house;
    });
    return result;
}

/**
 * Search by string in all values
 *
 * @param String searchstr searchstring
 * @param Object JSONfile
 */
export function searchByString(searchstr, JSONfile) {
    let result = JSONfile.salar.filter((item) => {

        for (let key of Object.keys(item)) {

            let val = null;

            try {
                val = item[key].toLowerCase();
            } catch (e) {
                continue;
            }
            searchstr = searchstr.toLowerCase();

            // Debug
            // console.log("Searchstr is: " + searchstr);
            // console.log("Val is: " + val);
            // console.log("Cond: " + val.includes(searchstr) > 0);

            if (val.includes(searchstr) > 0) {
                return true;
            }
        }
    });
    return result;
}

export function searchByStringEnhanced(searchstr, JSONfile) {

    // important fields list (props) and multiplication ratio (values)
    let importantFields = {
        "Salsnr" : 2,
        "Salsnamn" : 2,
        "Ort" : 1.1
    };

    let result = JSONfile.salar.filter((item) => {

        for (let key of Object.keys(item)) {
            let val = null;
            // prio sets the prioritizing rate 0 to 1.
            item.prio = 0;

            // Catch null values
            try {
                val = item[key].toLowerCase();
            } catch (e) {
                continue;
            }
            searchstr = searchstr.toLowerCase();

            // Debug
            // console.log("Searchstr is: " + searchstr);
            // console.log("Val is: " + val);
            // console.log("Cond: " + val.includes(searchstr) > 0);

            // Check for matches
            if (val === searchstr) {
                item.prio += 0.4;
                item.prio *= key in importantFields ? importantFields[key] : 1;
                return true;
            } else if (val.startsWith(searchstr)) {
                item.prio += 0.3;
                item.prio *= key in importantFields ? importantFields[key] : 1;
                return true;
            } else if (val.endsWith(searchstr)) {
                item.prio += 0.2;
                item.prio *= key in importantFields ? importantFields[key] : 1;
                return true;
            } else if (val.includes(searchstr) > 0) {
                return true;
            }

            // you can test code by searching for "7"
        }
    });
    // sort array
    result.sort((a, b) => {
        // console.log("a: " + a.prio);
        // console.log("b: " + b.prio);
        return a.prio < b.prio;
    });

    return result;
}
