(function() {
/* Start angularPutio */

var angularPutio = angular.module('Putio', []);

angularPutio.service('putio', [
  '$rootScope',
  '$http',
  'localStorageService',
  function($rootScope, $http, storage) {

    var put = {
      baseUrl: "https://api.put.io/v2/",
      buildUrl: function(method) {
        return this.baseUrl + method + "?oauth_token="+storage.get("settings").oauth_token;
      },
      ignoreFileTypes: [

      ],
      get: function(method, params, callback) {
        if (typeof params === "function") {
          callback = params;
          params = {};
        }
        var url = this.buildUrl(method)+"&callback=JSON_CALLBACK";
        for (var i in params) {
          url += "&"+i+"="+params[i];
        }

        $http.jsonp(url).success(callback);
      },
      post: function(method, params, callback) {
        var url = this.buildUrl(method);
        if (params === undefined) params = {};

        var postdata = "";
        for (var i in params) {
          postdata += i+"="+encodeURIComponent(params[i]+"&");
        }
        console.log(url);
        console.log(postdata);
        var yql_url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20htmlpost%20where%0Aurl%3D'"+url+"'%0Aand%20postdata%3D%22"+postdata+"%22%20and%20xpath%3D%22%22%20&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK";
        
        $http.jsonp(yql_url).success(callback).error(function(e) {
          console.log(error);
          console.log(e);
        });
      },
      putMagnet: function(uri, callback) {
        put.post("transfers/add", { url: uri }, callback);
      },
      delete: function(id,callback) {
        put.post("files/delete",{file_ids:id},callback);
      },
      getFiles: function(parent, callback) {
        this.get("files/list",{parent_id:parent}, function(data) {
          var files = data.files;
          var returnFiles = [];
          for (var i in files) {
            files[i].icon = "";
            if (files[i].content_type.indexOf("audio") > -1) {
              files[i].icon = "audio";

            }
            if (files[i].content_type.indexOf("video") > -1 && files[i].name.indexOf("sample") === -1) {
              files[i].icon = "video";
            }
            if (files[i].content_type.indexOf("image") > -1 && files[i].name.toLowerCase().indexOf("box art") === -1 && files[i].name.toLowerCase().indexOf("cover") === -1 && files[i].name.toLowerCase().indexOf("screencap") === -1) {
              //icon = "image";
            }
            if (files[i].content_type.indexOf("directory") > -1) {
              files[i].icon = "directory";
            }

            if (files[i].icon) {
              returnFiles.push(files[i]);
            }
          }
          callback(returnFiles);
        });
      }
    };

    return put;
  }

]);
}).call(this);