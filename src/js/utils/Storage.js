
// TODO perform some validation if global.localStorage exists or not
var localStorage = global.localStorage || null,
    Storage;

Storage = {

        exists: localStorage ?  true : false,

        /**
         * Try to get the data in the storage, if nothing is found returns false, or else the json parsed array
         * @param key
         * @returns {*}
         */

        getData: function getData(key) {

            if(!localStorage) return;

            var data;

            data = localStorage.getItem(key);
            // convert anything to javascript types true or false, booleans, objects, arrays, etc
            return JSON.parse(data);
        },

        /**
         * Try to set a new data information, returns true if the data was correctly passed
         *
         * @param key
         * @param data
         * @returns getData (array)
         */
        setData: function setData(key, data) {

            if(!localStorage) return;

            data = JSON.stringify(data);

            if (data) {
                localStorage.setItem(key, data);
            }

            return Storage.getData(key);
        },


        /**
         * Shorthand for setting data that area basicaly true or false
         * @param key
         * @returns setData -> getData -> array
         */
        toggleBoolean: function toggleBoolean(key) {

            if(!localStorage) return;

            var buttonStatus;

            buttonStatus = Storage.getData(key);

            if (buttonStatus) {
                return Storage.setData(key, false);
            }

            return Storage.setData(key, true);
        }
    };

module.exports = Storage;
