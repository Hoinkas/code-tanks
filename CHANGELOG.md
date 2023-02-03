# Change Log

All notable changes, features and known issues to the "code-tanks" extension will be documented in this file.

---
## Known Issues

1. When file is not selected there is no information why game won't load. Selecting file is necessary to run game thus error message is needed.
2. When tank is generated it can overwrite walls. Necessary to block tank generating in narrow spaces. When tank is generated near the wall on vertical map let tank face another direction. When tank is generated on horizontal map move it to the right into nearest empty space for it or move one line up or one line down (in that order).
3. When cursor is at first line of code it slice in half (falling will fix it)
4. File with one line throw error. Add error popup for that case saying something like "Rendering one-line map is not possible. Select another file with more than one line".
4. Files with multiple lines render tank midair. Add error popup saying "There must be at least one line of code at 3 line or below".
---
## Planned features

- Add left-right tank movement
- Add tank falling
- Add left-right riffle movement
- Add shooting in straight lines
- Add shooting in proper projectile motion
- Add enemy
- Add tank health bar
- Add water 
- Add terrain descrution
---
## Release Notes

### [0.0.1]
First implementation of game. Running extension and creating map from selected code in file.
Adding gamer's tank at cursor location at highest point.
Modeled first version of ASCII tank pointing east, west, north-east, north-west

![ASCII tank on top of building made from letters between another buildings](https://github.com/Hoinkas/code-tanks/tree/main/screenshots/Tank_on_vertical_map_0.0.1.png?raw=true)
![Tank models](https://github.com/Hoinkas/code-tanks/tree/main/screenshots/tank_models_0.0.1.png?raw=true)

### [0.0.2]
Added horizontal map rendering (without turning clockwise).
It's now possible to switch between horizontal and vertical version of map via Code Tank settings (Map Render)

![ASCII tank on top of line of code](https://github.com/Hoinkas/code-tanks/tree/main/screenshots/Tank_on_horizontal_map_0.0.2.png?raw=true)