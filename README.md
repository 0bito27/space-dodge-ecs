#  ECS Space Game

A simple 2D game built in JavaScript using an Entity-Component-System (ECS) architecture and functional programming principles.

##  Overview

This project demonstrates how to structure a game using ECS:
- **World** – global state and entity container
- **Entities** – game objects (player, obstacles)
- **Components** – pure data (Position, Velocity, Collider, etc.)
- **Systems** – pure functions that transform the world

All game logic is implemented using functional techniques like **map**, **filter**, and **reduce**.

##  Features

- ECS-based architecture
- Functional programming approach (no mutation)
- Player movement system
- Collision detection
- Procedural obstacle spawning
- Dynamic difficulty scaling
- Pause and restart system

---

##  Controls

- **WASD / Arrow keys** – Move
- **P** – Pause
- **R** – Restart

##  Tech Stack

- JavaScript (ES6 modules)
- HTML5 Canvas

##  Project Structure

- /src
- /ecs
- world.js # world structure and entity helpers
- systems/ # game systems (movement, spawn, collision, etc.)
- main.js # game loop and system composition
- input.js # keyboard input handling
- render.js # drawing on canvas

##  How It Works

Each frame:
1. Input is processed
2. Systems are applied to the world
3. A new world is returned (immutability)
4. The result is rendered on screen

Example concept:

- world -> movementSystem -> spawnSystem -> collisionSystem -> render

##  Future Improvements

- Sound effects
- Better graphics / animations
- Mobile support
- Score saving (backend)

##  Demo

![Gameplay](demo.gif)
