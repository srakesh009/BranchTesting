'use strict';

//angular.module('comsApp.services', [])
 //Some changes
/**
 * @service Configuration
 * environments are defined in environmentSettings.js
 * sets "global" constant configuration  settings
 * @return {Object} configModel
 */
    .factory("Configuration", function ($location,EnvironmentConfiguration) {
        var configModel = {};

        for (var env in EnvironmentConfiguration.environments) {

            if (EnvironmentConfiguration.environments[env].hostNames.indexOf($location.host().toUpperCase()) != -1) {

                angular.extend(configModel, EnvironmentConfiguration.environments[env]);
            }
        }
        return configModel;
    })
/**
 * Central Web Service call function
 */
    .factory("WebService", function ($http, $log) {
        return {
            /**
             * TODO Add JSDoc comment.
             *
             * @param {String} request
             * @param {Object} parameters
             */
            send: function (request, parameters) {
                if (parameters == undefined || parameters == null) {
                    return;
                }

                if (parameters.onError == undefined || parameters.onError == null) {
                    parameters.onError = function (data, status, headers, config) {
                        $log.error("comsApp.services.WebService.send: HTTP ERROR [ METHOD: " + config.method + ", STATUS: " + status + ", URL: " + config.url + " ]");
                        // TODO : swap these and change the test to succeed
                      //  $log.info(angular.toJson(config.data));
                     //   $log.info(angular.toJson(data));

                    };
                }

                return $http.post(parameters.to, request).success(parameters.onSuccess).error(parameters.onError);
            }
        };
    })
/**
 * Base 64 Function
 */
    .factory('Base64', function () {
        var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        return {
            encode: function (input) {
                var output = "", chr1, chr2, chr3 = "",enc1, enc2, enc3, enc4 = "",i = 0;

                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);

                return output;
            },

            decode: function (input) {
                var output = "",chr1, chr2, chr3 = "",enc1, enc2, enc3, enc4 = "",i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";

                } while (i < input.length);

                return output;
            }
        };
    });