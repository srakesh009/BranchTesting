//'use strict';
  //changes made in first branch second commit
/**
 * TODO Add JSDoc comment.
 */
angular.module("comsApp.services").factory("Documentum", function (WebService, Configuration, Templates,$log) {

    /**
     * TODO Add JSDoc comment.
     *
     * @param {String} body
     * @return {String}
     */
    var request = function(body) {
        // User.checkAuthUser();
            return Templates.DOCUMENTUM_SOAP_ENVELOPE.replace(/\{userName\}/g, Configuration.DCTM_LOGIN )
                                                     .replace(/\{password\}/g, Configuration.DCTM_PASS )
                                                     .replace(/\{repository\}/g, Configuration.DCTM_REPOSITORY )
                                                     .replace(/\{body\}/g, body);
    };



    return {

        dctmProperties : function(data , obj){
            // handle successful data or leave alone
            if (!data.Envelope.Body.executeResponse['return'].dataPackage.DataObjects ) {
                return data;
            }else{
                data = data.Envelope.Body.executeResponse['return'].dataPackage.DataObjects
            }
            for (var i in data){
                obj[i] = {}
                if (data[i].Identity){
                    if (data[i].Identity.ObjectId._id){
                        obj[i].id= data[i].Identity.ObjectId._id;
                    }
                }
                if (data[i].Properties){
                    if (data[i].Properties.Properties){
                        for (var j in data[i].Properties.Properties){
                            for (var k in data[i].Properties.Properties[j]){
                                for (var item in data[i].Properties.Properties[j][k]) {
                                    if  (item == "__text"){
                                        obj[i][data[i].Properties.Properties[j]._name]=data[i].Properties.Properties[j][k].__text ;
                                    }
                                }
                            }
                        }
                    }
                }

            }
        },

        /**
         * @function getDocumentFromId
         *
         * @param {String}   objectId
         * @param {Function} [success]
         * @param {Function} [error]
         * @return {Object}                     The promise returned by the WebService service.
         */
        getDocumentFromId: function(objectId, success, error) {

           // $log.info("getDocumentFromId "+ objectId)

            var message = Templates.GET_OBJECT_REQUEST.replace(/\{objectId\}/g, objectId)
                                                      .replace(/\{repository\}/g, Configuration.DCTM_REPOSITORY );

            // $log.info(request(message))

            return WebService.send(request(message), {
                to:         Configuration.DCTMSERVICE_URL_OBJECT,
                onSuccess:  success,
                onError:    error
            });
        },

        /**
         * TODO Add JSDoc comment.
         *
         * @param {String}   query
         * @param {Function} [success]
         * @param {Function} [error]
         * @return {Object}             The promise returned by the WebService service.
         */
        query: function(query, success, error) {
            var message = Templates.QUERY_REPOSITORY.replace(/\{query\}/g, query)
                                                    .replace(/\{repository\}/g, Configuration.DCTM_REPOSITORY );

            return WebService.send(request(message), {
                to:         Configuration.DCTMSERVICE_URL_QUERY,
                onSuccess:  success,
                onError:    error
            });
        }


    }
});