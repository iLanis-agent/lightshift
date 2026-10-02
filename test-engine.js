var E = require('./engine.js'), n = 0, bad = 0;
function near(a, b, tol, m) { n++; if (!(Math.abs(a - b) <= tol)) { bad++; console.log('FAIL', m, a, b); } }
function is(a, b, m) { n++; if (a !== b) { bad++; console.log('FAIL', m, a, b); } }
var NY = 40.7128, NYL = -74.006, h = function (hh, mm, ss) { return hh + mm / 60 + ss / 3600; };
// timeanddate.com New York 2026 daylength: Jun 21 15:05:37, Dec 21 9:15:17, Oct 1 11:45:19, Oct 2 11:42:39 (tolerance 1 min)
near(E.dayLengthHours(NY, 2026, E.doyOf(2026, 6, 21), NYL), h(15, 5, 37), 1 / 60, 'NY Jun 21');
near(E.dayLengthHours(NY, 2026, E.doyOf(2026, 12, 21), NYL), h(9, 15, 17), 1 / 60, 'NY Dec 21');
near(E.dayLengthHours(NY, 2026, E.doyOf(2026, 10, 1), NYL), h(11, 45, 19), 1 / 60, 'NY Oct 1');
near(E.dayLengthHours(NY, 2026, E.doyOf(2026, 10, 2), NYL), h(11, 42, 39), 1 / 60, 'NY Oct 2');
// daily change on Oct 2 at NY is -2:40 (timeanddate); allow 20 s
near(E.dailyChangeSec(NY, 2026, E.doyOf(2026, 10, 2), NYL), -160, 15, 'NY Oct 2 change');
// London Jun 21 2026 16:38:22; Sydney Dec 21 2026 14:24:46; Jerusalem Mar 21 2026 12:09:13 (+1:57 vs Mar 20) - timeanddate.com
near(E.dayLengthHours(51.5074, 2026, E.doyOf(2026, 6, 21), -0.1278), h(16, 38, 22), 1 / 60, 'London Jun 21');
near(E.dayLengthHours(-33.8688, 2026, E.doyOf(2026, 12, 21), 151.2093), h(14, 24, 46), 1 / 60, 'Sydney Dec 21');
near(E.dayLengthHours(31.7683, 2026, E.doyOf(2026, 3, 21), 35.2137), h(12, 9, 13), 1 / 60, 'Jerusalem Mar 21');
near(E.dailyChangeSec(31.7683, 2026, E.doyOf(2026, 3, 21), 35.2137), 117, 15, 'Jerusalem Mar 21 change');
// equator: close to 12h07m all year (refraction adds about 7 min)
near(E.dayLengthHours(0, 2026, 80, 0), 12.12, 0.05, 'equator'); near(E.dayLengthHours(0, 2026, 172, 0), 12.12, 0.05, 'equator jun');
// polar: Tromso-ish 78N has midnight sun in June and polar night in December; 0 and 24 are exact
is(E.dayLengthHours(78, 2026, 172, 0), 24, 'polar day'); is(E.dayLengthHours(78, 2026, 355, 0), 0, 'polar night');
// symmetry: southern hemisphere mirrors north, about 6 months apart
near(E.dayLengthHours(-33, 2026, 172, 0), E.dayLengthHours(33, 2026, 355, 0), 0.1, 'mirror');
// extremes at NY land near the solstices (Jun 20-22, Dec 20-22)
var x = E.extremes(NY, 2026, NYL); is(x.longest.doy >= 170 && x.longest.doy <= 173, true, 'longest near Jun 21'); is(x.shortest.doy >= 354 && x.shortest.doy <= 357, true, 'shortest near Dec 21');
// calendar
is(E.doyOf(2026, 3, 1), 60, 'doy Mar 1 2026'); is(E.doyOf(2028, 3, 1), 61, 'doy Mar 1 2028 leap'); is(E.doyOf(2026, 12, 31), 365, 'doy Dec 31'); is(E.yearDays(2100), 365, '2100 not leap'); is(E.yearDays(2000), 366, '2000 leap');
is(E.dateOf(2026, 60), '2026-03-01', 'dateOf'); is(E.hms(11.7108), '11h 42m 39s', 'hms');
console.log((n - bad) + '/' + n + ' passed'); process.exit(bad ? 1 : 0);
