/**
 * ORION Secure Configuration Loader
 * Restored for Jose/Chela/Mike compatibility.
 */
(function (window) {
    // Valid API Key (Base64 encoded - replace with your valid key)
    const _k = atob('QUl6YVN5QzdoSlJQQnFnNXh1WnJmb3gwNHhiQVVDNG1TY2c1TnJz');

    window.ORION_CONFIG = {
        getAuth: function () {
            return _k;
        }
    };
})(window);
