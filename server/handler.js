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

            try {
                var val = item[key].toLowerCase();
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
