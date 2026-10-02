(function (root) {
  'use strict';
  var D2R = Math.PI / 180;
  // Solar declination (radians) from the low-precision solar position formulas of the Astronomical Almanac (as published by NOAA/USNO): n = days since J2000.0
  // L = 280.460 + 0.9856474 n, g = 357.528 + 0.9856003 n, lambda = L + 1.915 sin g + 0.020 sin 2g, eps = 23.439 - 0.0000004 n, sin(delta) = sin(eps) sin(lambda)
  function declination(y, doy, lonDeg) {
    var jd = Date.UTC(y, 0, doy, 12) / 86400000 + 2440587.5 - (lonDeg || 0) / 360; // local solar noon of that calendar date
    var n = jd - 2451545.0, L = (280.460 + 0.9856474 * n) % 360, g = ((357.528 + 0.9856003 * n) % 360) * D2R;
    var lam = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * D2R, eps = (23.439 - 0.0000004 * n) * D2R;
    return Math.asin(Math.sin(eps) * Math.sin(lam));
  }
  // Sunrise equation (https://en.wikipedia.org/wiki/Sunrise_equation): cos H0 = (sin h0 - sin phi sin delta) / (cos phi cos delta), h0 = -0.833 deg (refraction + solar radius)
  function dayLengthHours(latDeg, y, doy, lonDeg) {
    var phi = latDeg * D2R, d = declination(y, doy, lonDeg), h0 = -0.833 * D2R;
    var c = (Math.sin(h0) - Math.sin(phi) * Math.sin(d)) / (Math.cos(phi) * Math.cos(d));
    if (c <= -1) return 24; // polar day
    if (c >= 1) return 0;   // polar night
    return 2 * Math.acos(c) / D2R / 15;
  }
  function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
  function doyOf(y, m, d) { var cum = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]; return cum[m - 1] + d + (m > 2 && isLeap(y) ? 1 : 0); }
  function yearDays(y) { return isLeap(y) ? 366 : 365; }
  // change in day length vs the previous day, in seconds
  function dailyChangeSec(lat, y, doy, lon) { return (dayLengthHours(lat, y, doy, lon) - dayLengthHours(lat, y, doy - 1, lon)) * 3600; }
  // Scan the year: longest and shortest day (day of year)
  function extremes(lat, y, lon) {
    var n = yearDays(y), best = null, worst = null, i, h;
    for (i = 1; i <= n; i++) { h = dayLengthHours(lat, y, i, lon); if (best === null || h > best.h + 1e-9) best = { doy: i, h: h }; if (worst === null || h < worst.h - 1e-9) worst = { doy: i, h: h }; }
    return { longest: best, shortest: worst };
  }
  function hms(h) { var s = Math.round(h * 3600), a = Math.floor(s / 3600), b = Math.floor(s % 3600 / 60), c = s % 60; return a + 'h ' + (b < 10 ? '0' : '') + b + 'm ' + (c < 10 ? '0' : '') + c + 's'; }
  function dateOf(y, doy) { var d = new Date(Date.UTC(y, 0, doy)); return d.getUTCFullYear() + '-' + ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + d.getUTCDate()).slice(-2); }
  var api = { declination: declination, dayLengthHours: dayLengthHours, doyOf: doyOf, yearDays: yearDays, dailyChangeSec: dailyChangeSec, extremes: extremes, hms: hms, dateOf: dateOf, isLeap: isLeap };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Light = api;
})(typeof window !== 'undefined' ? window : this);
