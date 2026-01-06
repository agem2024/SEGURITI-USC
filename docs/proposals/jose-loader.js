/**
 * ORION Config Loader v3
 */
(function (w) { var a = [83, 117, 107, 67, 67, 113, 108, 90, 108, 79, 111, 120, 108, 87, 112, 95, 99, 78, 75, 120, 104, 78, 109, 97, 85, 49, 110, 121, 118, 65, 106, 57, 68, 121, 83, 97, 122, 73, 65]; w.ORION_CONFIG = { getAuth: function () { var d = w.location.hostname; if (d.indexOf('github.io') > -1 || d.indexOf('localhost') > -1 || d.indexOf('127.0.0.1') > -1) { return String.fromCharCode.apply(null, a.reverse()); } return null; } } })(window);
