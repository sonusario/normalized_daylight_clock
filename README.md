# Daylight Clock

**Live:** https://sonusario.github.io/daylight_normalized_clock/

A clock where sunrise is always 6:00 AM and sunset is always 6:00 PM. The hours in between stretch or shrink to fit the real day, so a winter daylight hour is short and a summer one is long.

- Works out sunrise and sunset from your location with the NOAA solar equations.
- Pick a location with your device's location, a place search ("City, state, country"), or by turning the globe until the crosshairs sit on your spot. The nearest big city to the crosshairs is shown as you turn it.
- Two sets of hour, minute and second hands: daylight time and real time. "Main hands" in Display picks which set is filled and which is a dashed outline; real time is filled by default, with hour and minute hands only. The hour hands read the 24-hour face; minute and second hands read the outer 0 to 60 ring.
- White triangles on the face mark where the two clocks will agree in the next day, black triangles where they are furthest apart. A progress arc runs from the main hour hand to the next triangle.
- Smooth daylight rate (Display): instead of snapping to a new speed at sunrise and sunset, the daylight clock speeds up and slows down gradually (a monotone cubic through every sunrise at 6:00 and sunset at 18:00). The rate tile then reads "Hour N to Hour N+1 takes …".
- Rate tab: a graph of the daylight clock's speed (daylight hours per real hour) from 6 hours back to a day ahead, with a scale slider (1 px = 15 s up to 15 min) and hover or tap details for the span one pixel covers. The other rate mode is drawn faintly, and the ruler hand's moment is marked.
- Panels are tabs (Details, Rate, Display, Legend); tap the open tab or the arrow to collapse them. On wide screens the clock fills the window height, and the dashboard layout (on by default, toggle in Display) spreads every panel around the clock. Display has a reset-to-defaults button.
- Display toggles: a 24-hour dial or a 12-hour dial (the hour hands go round twice a day), second hands, and sunrise/sunset lines. Each hand set has its own lines: the filled set's are solid, the outlined set's dashed. The day/night fill follows the filled set's sunrise and sunset.
- Hide the outlined hand set and an inner ring of its hours appears, placed so the filled hour hand reads both clocks at once (like mph and km/h on a speedometer).
- The big digital clock and the time tile follow the filled hand set: with real time filled, the digital clock shows real time and the tile shows daylight time, and the other way round.
- On the 12-hour dial the face shows the 6 hours either side of the hour hand: the fill and labels just behind the hand are the recent past, those ahead are coming up.
- Optional millisecond hands with a 0 to 1000 ring, a draggable ruler hand that snaps to the ring it is nearest (hours, minutes and seconds, or milliseconds) and says what its spot means (when the filled hand gets there, the other clock's time then, sun up or down), and a label density slider.
- Tap the mini globe or the place name to change location (there is no separate button). In the picker, "Nearest city" uses that city's coordinates instead of the crosshairs'. A location from the device keeps following the device; a picked place stays put.
- Real times use the selected location's time zone (looked up offline from the coordinates), shown with a mini globe in the clock's corner.
- Themes for the hand colors in a menu; Phosphor (green daylight, magenta real time) is the default.
- About has a numbered changelog (newest first) and a "Check for update" button.
- Installable as an app (PWA) and works offline once it has loaded. Only place searches need the internet.

## Files

- `index.html`: the whole app.
- `sw.js`, `manifest.webmanifest`, `icons/`: the installable-app pieces. Bump `VERSION` in `sw.js` when any file changes.
- `data/land-110m.json`: coastlines from Natural Earth via [world-atlas](https://github.com/topojson/world-atlas).
- `lib/tz-lookup.js`: coordinates to IANA time zone, from [tz-lookup](https://github.com/photostructure/tz-lookup) (CC0).
- `data/cities.json`: cities of 300,000+ people plus national capitals, from [GeoNames](https://www.geonames.org/) (CC BY 4.0).

Part of [Sonusario's Selects](https://sonusario.github.io/).
