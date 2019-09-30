app.provider('fileManagerConfig', function () {
    var bridgePath = 'bridges/php/handler.php';
    var values = {
        appName: 'AngularJS File Manager',
        defaultLang: 'en',
        multiLang: true,
        bridgePath: bridgePath,
        listUrl: bridgePath,
        uploadUrl: bridgePath,
        renameUrl: bridgePath,
        copyUrl: bridgePath,
        moveUrl: bridgePath,
        removeUrl: bridgePath,
        editUrl: bridgePath,
        getContentUrl: bridgePath,
        createFolderUrl: bridgePath,
        downloadFileUrl: bridgePath,
        downloadMultipleUrl: bridgePath,
        compressUrl: bridgePath,
        extractUrl: bridgePath,
        permissionsUrl: bridgePath,
        basePath: '/',

        searchForm: true,
        sidebar: true,
        breadcrumb: true,
        allowedActions: {
            upload: true,
            rename: true,
            move: true,
            copy: true,
            edit: true,
            changePermissions: true,
            compress: true,
            compressChooseName: true,
            extract: true,
            download: true,
            downloadMultiple: true,
            preview: true,
            remove: true,
            createFolder: true,
            pickFiles: false,
            pickFolders: false
        },

        multipleDownloadFileName: 'angular-filemanager.zip',
        filterFileExtensions: [],
        showExtensionIcons: true,
        showSizeForDirectories: false,
        useBinarySizePrefixes: false,
        downloadFilesByAjax: true,
        previewImagesInModal: true,
        enablePermissionsRecursive: true,
        compressAsync: false,
        extractAsync: false,
        pickCallback: null,

        isEditableFilePattern: /\.(txt|diff?|patch|svg|asc|cnf|cfg|conf|html?|.html|cfm|cgi|aspx?|ini|pl|py|md|css|cs|js|jsp|log|htaccess|htpasswd|gitignore|gitattributes|env|json|atom|eml|rss|markdown|sql|xml|xslt?|sh|rb|as|bat|cmd|cob|for|ftn|frm|frx|inc|lisp|scm|coffee|php[3-6]?|java|c|cbl|go|h|scala|vb|tmpl|lock|go|yml|yaml|tsv|lst)$/i,
        isImageFilePattern: /\.(jpe?g|gif|bmp|png|svg|tiff?)$/i,
        isExtractableFilePattern: /\.(gz|tar|rar|g?zip)$/i,
        tplPath: 'src/templates'
    };

    return {
        $get: function () {
            return values;
        },
        set: function (constants) {
            angular.extend(values, constants);
        },
        setBridge: function (path) {

            bridgePath = path;
            values.bridgePath = path;
            values.listUrl = path;
            values.uploadUrl = bridgePath;
            values.renameUrl = bridgePath;
            values.copyUrl = bridgePath;
            values.moveUrl = bridgePath;
            values.removeUrl = bridgePath;
            values.editUrl = bridgePath;
            values.getContentUrl = bridgePath;
            values.createFolderUrl = bridgePath;
            values.downloadFileUrl = bridgePath;
            values.downloadMultipleUrl = bridgePath;
            values.compressUrl = bridgePath;
            values.extractUrl = bridgePath;
            values.permissionsUrl = bridgePath;

        }
    };

});
