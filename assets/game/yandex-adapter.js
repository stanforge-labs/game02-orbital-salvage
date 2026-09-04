(function () {
  'use strict';

  var localHost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  var state = { initialized: false, sdk: null, initPromise: null, gameplay: false };

  function init() {
    if (state.initPromise) return state.initPromise;
    if (localHost) {
      state.initPromise = Promise.resolve(null);
      return state.initPromise;
    }
    if (typeof YaGames === 'undefined') {
      if (!localHost) console.error('[Orbital Salvage] /sdk.js не загрузился на production host.');
      state.initPromise = Promise.resolve(null);
      return state.initPromise;
    }
    state.initPromise = YaGames.init().then(function (ysdk) {
      state.sdk = ysdk;
      state.initialized = true;
      if (ysdk.features && ysdk.features.LoadingAPI) ysdk.features.LoadingAPI.ready();
      return ysdk;
    }).catch(function (error) {
      console.error('[Orbital Salvage] YaGames.init() завершился ошибкой.', error);
      return null;
    });
    return state.initPromise;
  }

  function gameplayStart() {
    if (state.gameplay) return;
    state.gameplay = true;
    init().then(function (ysdk) {
      if (ysdk && ysdk.features && ysdk.features.GameplayAPI) ysdk.features.GameplayAPI.start();
    });
  }

  function gameplayStop() {
    if (!state.gameplay) return;
    state.gameplay = false;
    init().then(function (ysdk) {
      if (ysdk && ysdk.features && ysdk.features.GameplayAPI) ysdk.features.GameplayAPI.stop();
    });
  }

  function showRewarded(reason) {
    if (localHost && (!state.sdk || !state.initialized)) {
      return Promise.resolve(true);
    }
    return init().then(function (ysdk) {
      if (!ysdk || !ysdk.adv || typeof ysdk.adv.showRewardedVideo !== 'function') {
        console.error('[Orbital Salvage] Rewarded Video недоступен.', reason);
        return false;
      }
      return new Promise(function (resolve) {
        var rewarded = false;
        ysdk.adv.showRewardedVideo({
          callbacks: {
            onOpen: function () {},
            onRewarded: function () { rewarded = true; },
            onClose: function () { resolve(rewarded); },
            onError: function (error) { console.error('[Orbital Salvage] Ошибка Rewarded Video.', error); resolve(false); },
            onOffline: function () { console.error('[Orbital Salvage] Rewarded Video недоступен офлайн.'); resolve(false); }
          }
        });
      });
    });
  }

  window.__osYandex = {
    init: init,
    gameplayStart: gameplayStart,
    gameplayStop: gameplayStop,
    showRewarded: showRewarded
  };
  init();
}());
