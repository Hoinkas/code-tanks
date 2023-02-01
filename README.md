# Code Tanks Game README

Game which allow you to destroy your current code file with tanks and explosions.

## Features

Extension allows to run game in virtual document, which doesn't interefee with original file. It create map from selected file's code and put mini tank in it which you can move and shoot at your code making damage to it.

---
## Known Issues

- When file is not selected there is no information why game won't load. Selecting file is necessary to run game thus error message is needed.
- When tank is generated it can overwrite walls. Necessarly to block tank generating in narrow spaces or increase lenght of the land. When tank is generated near the wall let tank face another direction.

## Release Notes

### 0.0.1
First implementation of game. Running extension and creating map from selected code in file.
Adding gamer's tank at cursor location at highest point.

![ASCII tank on top of building made from letters between another buildings](https://github.com/Hoinkas/code-tanks/tree/main/screenshots/Tank_on_clockwise_rotated_map_0.0.1.png?raw=true)

---
## Planned features

- Add normal map rendering (without turning 90 degrees clockwise). It would look better I suppose
- Add setting allowing to switch between normal map render and clockwise render
- Add left-right tank movement
- Add tank falling
- Add left-right riffle movement
- Add shooting in straight lines
- Add shooting in proper projectile motion
- Add enemy
- Add tank health bar
- Add water
- Add terrain descrution