# LightShift

Day length for any place and date, minutes gained or lost per day, and the year curve.

Sunrise equation: cos H0 = (sin h0 - sin phi sin delta) / (cos phi cos delta), h0 = -0.833 deg (https://en.wikipedia.org/wiki/Sunrise_equation). Solar declination from the Astronomical Almanac low-precision formulas evaluated at local solar noon of the date.
Tests: 23 checks against timeanddate.com 2026 day lengths: New York Jun 21 15:05:37, Dec 21 9:15:17, Oct 1 11:45:19, Oct 2 11:42:39 (change -2:40); London Jun 21 16:38:22; Sydney Dec 21 14:24:46; Jerusalem Mar 21 12:09:13 (change +1:57). Tolerance 1 minute (15 s on the daily change). Also equator, polar day and night, hemisphere mirror, solstice dates, and calendar math.
Real sunrise varies with weather, terrain and elevation.

Static client-side. `node test-engine.js` runs the tests.
