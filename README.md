
# AngularJS File Manager

This is a pretty handy file manager to explore your files on the server in the browser developed in AngularJS using Bootstrap 4

This project is based on excellent work of [Jonas Sciangula Street](https://github.com/joni2back), but since he's not planning to maintain it I'm moving forward with my own fork. provides a web file manager interface, **allowing you to create your own backend connector** following the [connector API](API.md). 

*By the way, we provide some example backend connectors in many languages as example (php-ftp, php-local, python, etc)*

[![Build Status](https://travis-ci.com/azerafati/angularjs-filemanager.svg?branch=master)](https://travis-ci.org/azerafati/angularjs-filemanager)
[![npm version](https://img.shields.io/npm/v/@azerafati/angularjs-filemanager.svg)](https://www.npmjs.com/package/angularjs-filemanager)
[![GitHub issues](https://img.shields.io/github/issues/azerafati/angularjs-filemanager)](https://github.com/azerafati/angularjs-filemanager/issues)
![Dependency Status](https://img.shields.io/david/azerafati/angularjs-filemanager)
[![Coverage Status](https://coveralls.io/repos/github/azerafati/angularjs-filemanager/badge.svg?branch=master)](https://coveralls.io/github/azerafati/angularjs-filemanager?branch=master)
![npm](https://img.shields.io/npm/dt/@azerafati/angularjs-filemanager)
[![GitHub license](https://img.shields.io/github/license/azerafati/angularjs-filemanager)](https://github.com/azerafati/angularjs-filemanager/blob/master/LICENSE)



### [Try the DEMO](https://angularjs-filemanager.azerafati.com/)
![](https://repository-images.githubusercontent.com/59879464/8605c980-e2f2-11e9-8d42-57f40cd27d8c "AngularJS File Manager")
---------

### Install

   **1) Run `npm i @azerafati/angularjs-filemanager --save`**
   
   **2) Install dependencies**
   
   **3) Include the dependencies in your project**
   ```html
   <!-- third party -->
     <script src="/node_modules/jquery/dist/jquery.min.js"></script>
     <script src="/node_modules/angular/angular.min.js"></script>
     <script src="/node_modules/angular-translate/dist/angular-translate.min.js"></script>
     <script src="/node_modules/ng-file-upload/dist/ng-file-upload.min.js"></script>
     <script src="/node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
   
   <!-- angularjs-filemanager -->
     <link rel="stylesheet" href="/node_modules/@azerafati/angularjs-filemanager/dist/angular-filemanager.css">
     <script src="node_modules/@azerafati/angularjs-filemanager/dist/angular-filemanager.js"></script>
   ```
**4) Use the angular directive in your HTML**
```html
<angularjs-filemanager></angularjs-filemanager>
```    
   ```javascript
   angular.module('AngularJS-FileManager').config(['fileManagerConfigProvider', function (config) {
     var defaults = config.$get();
     config.setBridge('/bridges/php-local/index.php');
     config.set({
       appName: 'AngularJS File Manager',
       pickCallback: function(item) {
         var msg = 'Picked %s "%s" for external use'
           .replace('%s', item.type)
           .replace('%s', item.fullPath());
         window.alert(msg);
       },
   
       allowedActions: angular.extend(defaults.allowedActions, {
         pickFiles: true,
         pickFolders: false,
       }),
     });
   }]);
   ```

---------

### Features
  - Multiple file support
  - Multilanguage
  - List and Icon view
  - Multiple file upload
  - Pick files callback for third parties apps
  - Search files
  - Directory tree navigation
  - Copy, Move, Rename (Interactive UX)
  - Delete, Edit, Preview, Download
  - File permissions (Unix chmod style)
  - Mobile support

### TODO
  - Drag and drop
  - Dropbox and Google Drive connectors
  - Remove usage of jQuery

### Backend API
[Read the docs](API.md)

---------

### Create a new build with your changes
```sh
  gulp build || node node_modules/gulp/bin/gulp.js build
```

You can do many things by extending the configuration. Like hide the sidebar or the search button. See [the list of default configurations](/src/js/providers/config.js).

---------

### Contribute
To contribute to the project you can simply fork this repo. To build a minified version, you can simply run the Gulp
task `gulp build`. The minified/uglified files are created in the `dist` folder.

### Versioning
For transparency into our release cycle and in striving to maintain backward compatibility, angular-filemanager is maintained under [the Semantic Versioning guidelines](http://semver.org/).

### Copyright and license
Code and documentation released under [the MIT license](https://github.com/joni2back/angular-filemanager/blob/master/LICENSE).
