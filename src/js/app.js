const app = angular.module('AngularJS-FileManager', ['pascalprecht.translate', 'ngFileUpload']);

/**
 * jQuery inits
 */
angular.element(window.document).on('shown.bs.modal', '.modal', function () {
    window.setTimeout(function () {
        angular.element('[autofocus]', this).focus();
    }.bind(this), 100);
});

angular.element(window.document).on('click', function () {
    angular.element('#angularjs-filemanager-context-menu').hide();
});

angular.element(window.document).on('contextmenu', '.main-navigation .table-files tr.item-list:has("td"), .item-list', function (e) {
    var menu = angular.element('#angularjs-filemanager-context-menu');

    if (e.pageX >= window.innerWidth - menu.width()) {
        e.pageX -= menu.width();
    }
    if (e.pageY >= window.innerHeight - menu.height()) {
        e.pageY -= menu.height();
    }

    menu.hide().css({
        left: e.pageX,
        top: e.pageY
    }).appendTo('body').show();
    e.preventDefault();
});
