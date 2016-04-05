/**
 * @ngdoc service
 * @name $ionicBackdrop
 * @module meteoric
 * @description
 * Shows and hides a backdrop over the UI.  Appears behind popups, loading,
 * and other overlays.
 *
 * Often, multiple UI components require a backdrop, but only one backdrop is
 * ever needed in the DOM at a time.
 *
 * Therefore, each component that requires the backdrop to be shown calls
 * `$ionicBackdrop.retain()` when it wants the backdrop, then `$ionicBackdrop.release()`
 * when it is done with the backdrop.
 *
 * For each time `retain` is called, the backdrop will be shown until `release` is called.
 *
 * For example, if `retain` is called three times, the backdrop will be shown until `release`
 * is called three times.
 *
 * **Notes:**
 * - The backdrop service will broadcast 'backdrop.shown' and 'backdrop.hidden' events from the root scope,
 * this is useful for alerting native components not in html.
 *
 * @usage
 *
 * ```js
 * function MyController($scope, $ionicBackdrop, $timeout, $rootScope) {
 *   //Show a backdrop for one second
 *   $scope.action = function() {
 *     $ionicBackdrop.retain();
 *     $timeout(function() {
 *       $ionicBackdrop.release();
 *     }, 1000);
 *   };
 *
 *   // Execute action on backdrop disappearing
 *   $scope.$on('backdrop.hidden', function() {
 *     // Execute action
 *   });
 *
 *   // Execute action on backdrop appearing
 *   $scope.$on('backdrop.shown', function() {
 *     // Execute action
 *   });
 *
 * }
 * ```
 */
export let IonBackdrop = {
  holds: 0,
  retain: function () {
    this.holds++;

    if (this.holds === 1) {
      this.template = Template['ionBackdrop'];
      this.view = Blaze.renderWithData(this.template, {}, $('.ionic-body').get(0));

      var $backdropEl = $(this.view.firstNode());
      $backdropEl.addClass('visible');

      Meteor.setTimeout(function () {
        $backdropEl.addClass('active');
      }, 10);
    }
  },

  release: function () {
    this.holds--;

    if (this.holds === 0) {
      var $backdropEl = $(this.view.firstNode());
      $backdropEl.removeClass('active');

      Meteor.setTimeout(function () {
        $backdropEl.removeClass('visible');
        Blaze.remove(this.view);
      }.bind(this), 400);
    }
  }
};