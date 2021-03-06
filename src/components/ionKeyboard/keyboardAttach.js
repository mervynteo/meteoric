/**
 * @ngdoc directive
 * @name keyboardAttach
 * @module meteoric
 * @restrict A
 *
 * @description
 * keyboard-attach is an attribute directive which will cause an element to float above
 * the keyboard when the keyboard shows. Currently only supports the
 * [ionFooterBar]({{ page.versionHref }}/api/directive/ionFooterBar/) directive.
 *
 * ### Notes
 * - This note is WIP. Check back later.
 * - This directive requires the
 * [Ionic Keyboard Plugin](https://github.com/driftyco/ionic-plugins-keyboard).
 * - On Android not in fullscreen mode, i.e. you have
 *   `<preference name="Fullscreen" value="false" />` or no preference in your `config.xml` file,
 *   this directive is unnecessary since it is the default behavior.
 * - On iOS, if there is an input in your footer, you will need to set
 *   `cordova.plugins.Keyboard.disableScroll(true)`.
 *
 * @usage
 *
 * ```html
 *  <ion-footer-bar alignTitle="left" keyboard-attach class="bar-assertive">
 *    <h1 class="title">Title!</h1>
 *  </ion-footer-bar>
 * ```
 */

import { TemplateAttributeDirectiveType } from 'meteor/meteoric124:template-attribute-directive';

let keyboardAttach = new TemplateAttributeDirectiveType('keyboardAttach', {
    $postLink($scope, $element, $attr) {
        let scope = $scope;

        ionic.on('native.keyboardshow', onShow, window);
        ionic.on('native.keyboardhide', onHide, window);

        //deprecated
        ionic.on('native.showkeyboard', onShow, window);
        ionic.on('native.hidekeyboard', onHide, window);


        var scrollCtrl;

        function onShow(e) {
            if (ionic.Platform.isAndroid() && !ionic.Platform.isFullScreen) {
                return;
            }

            //for testing
            var keyboardHeight = e.keyboardHeight || (e.detail && e.detail.keyboardHeight);
            element.css('bottom', keyboardHeight + "px");
            scrollCtrl = scope.scrollCtrl;
            if (scrollCtrl) {
                scrollCtrl.scrollView.__container.style.bottom = keyboardHeight + keyboardAttachGetClientHeight(element[0]) + "px";
            }
        }

        function onHide() {
            if (ionic.Platform.isAndroid() && !ionic.Platform.isFullScreen) {
                return;
            }

            element.css('bottom', '');
            if (scrollCtrl) {
                scrollCtrl.scrollView.__container.style.bottom = '';
            }
        }

        scope.$on('$destroy', function() {
            ionic.off('native.keyboardshow', onShow, window);
            ionic.off('native.keyboardhide', onHide, window);

            //deprecated
            ionic.off('native.showkeyboard', onShow, window);
            ionic.off('native.hidekeyboard', onHide, window);
        });
    }
});

function keyboardAttachGetClientHeight(element) {
    return element.clientHeight;
}

export { keyboardAttach };