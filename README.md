# SDU460
This project aims at replicating a well-known touch-based flight instrument for the purpose of desktop flight simulation. In particular it is designed as a standalone 'instrument' to be run on a RaspberryPI in combination with a touch-based monitor alongside the normal flight simulation PC. Currently the open-source flight simulator FlightGear is supported as data source.

As for the name ... the original screen has a similar number and belongs to the well-known G3X Touch family of devices found in many experimental as well as certified aircrafts. 

## Background and current status
First and foremost, this project is one hobbyist's endeavor for the joy of flying at home. It is *not* associated with Garmin (or any other manufacturer) in any way and does *not* use any resources (source code or artwork) of any real existing original product. Instead, everything is written from scratch, based on pure web standards and ES6 JavaScript. This software works without any 3rd party library apart from leaflet and leaflet-rotate for map display. Feel free to either use npm to install these dependencies or do it manually. 

As moving map, any maps in tiles format can be used. For current testing purposes, I opted for openflightmaps due to their availability in many regions.

## Known deviations

Currently the functionality is limited to the demands that I have as a pure VFR pilot that enjoys to train procedures at home, whenever possible. Therefore, everything displayed on screen is functional (all the dials, heading indicators, engine parameters, etc.) but advanced functions are not (yet) available. Mostly data is streamed from the flight simulator to this software and is visualized accordingly. However, both the transponder and the COM1 radio is controllable via touch interaction.

Main deviations from the original instrument's appearance:
- Different screen size (10.4" vs. 10.1") as well as different aspect ratio (1280x768 vs. 1280x800). Therefore, my screen is slightly smaller in diagonal and has 32 pixels more in vertical dimension.

Plans for further development (hardware):
- Physical dual-axis rotary encoder for heading and altitude bug.
- 3d printed bezel to cover the 10.1" screen.

Plans for further development (software):
- OBS display and VOR functionality.
- CDI with flight plan upload
