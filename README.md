# Fantasy Loop - Text-Based Game Engine

A flexible and powerful text-based game engine for creating interactive fiction and adventure games. Supports Python, JavaScript, and TypeScript implementations with identical features.

## Features

- 🎮 **Complete game engine** with room navigation, inventory, and item interaction
- 🗺️ **Flexible world building** using JSON configuration files
- 💾 **Save/Load system** to preserve game progress
- 🎯 **Command parser** with natural language support
- 🐍 **Python implementation** - Pure Python with no dependencies
- 🟨 **JavaScript implementation** - ES6+ compatible
- 🔷 **TypeScript implementation** - Fully typed for better development
- 📝 **JSON-based configuration** - Easy to create new games without coding

## Quick Start

### Python Version

**Requirements:** Python 3.6+

```bash
# Run with demo game
python game_engine.py

# Run with custom configuration
python game_engine.py
# (Will automatically load game_config.json if present)
```

### JavaScript Version

**Requirements:** Node.js 14+

```bash
# Install dependencies (optional, for TypeScript support)
npm install

# Run JavaScript version
node game_engine.js

# Run with npm script
npm start
```

### TypeScript Version

**Requirements:** Node.js 14+, TypeScript

```bash
# Install dependencies
npm install

# Run TypeScript version directly
npm run start:ts

# Or compile and run
npm run build
node dist/game_engine.js
```

## Game Commands

### Movement
- `go [direction]` or `move [direction]` - Move in a direction
- `north`, `south`, `east`, `west` (or `n`, `s`, `e`, `w`) - Quick direction shortcuts
- `up`, `down` - Vertical movement

### Actions
- `take [item]` or `get [item]` - Pick up an item
- `drop [item]` - Drop an item from inventory
- `examine [item]` or `x [item]` - Examine an item closely
- `use [item]` - Use an item (if usable)

### Information
- `look` or `l` - Look around the current room
- `inventory` or `inv` or `i` - Check your inventory
- `status` - Check player status (health, etc.)

### System
- `help` or `h` - Show help
- `save [filename]` - Save game (default: savegame.sav)
- `load [filename]` - Load a saved game
- `quit` or `exit` or `q` - Exit game

## Creating Your Own Game

### Option 1: Use JSON Configuration

Create a `game_config.json` file to define your game world:

```json
{
  "title": "My Adventure",
  "intro": "Welcome to my game!",
  "start_room": "starting_location",
  "rooms": {
    "starting_location": {
      "name": "Starting Room",
      "description": "You are in a small room.",
      "exits": {
        "north": "next_room"
      },
      "items": [
        {
          "name": "key",
          "description": "A rusty old key",
          "usable": false
        }
      ]
    },
    "next_room": {
      "name": "Next Room",
      "description": "You moved north!",
      "exits": {
        "south": "starting_location"
      },
      "items": []
    }
  }
}
```

### Option 2: Programmatic Creation (Python)

```python
from game_engine import Game, Room, Item

# Create game
game = Game()
game.game_title = "My Custom Game"
game.game_intro = "Welcome!"

# Create rooms
room1 = Room("Starting Room", "A simple room")
room1.add_exit("north", "room2")
room1.add_item(Item("sword", "A sharp sword", True, "You swing the sword!"))

room2 = Room("North Room", "You went north")
room2.add_exit("south", "room1")

# Add rooms to game
game.add_room("room1", room1)
game.add_room("room2", room2)

# Set starting location
game.player.current_room = "room1"

# Start the game
game.start()
```

### Option 3: Programmatic Creation (JavaScript/TypeScript)

```javascript
const { Game, Room, Item } = require('./game_engine');

// Create game
const game = new Game();
game.game_title = "My Custom Game";
game.game_intro = "Welcome!";

// Create rooms
const room1 = new Room("Starting Room", "A simple room");
room1.addExit("north", "room2");
room1.addItem(new Item("sword", "A sharp sword", true, "You swing the sword!"));

const room2 = new Room("North Room", "You went north");
room2.addExit("south", "room1");

// Add rooms to game
game.addRoom("room1", room1);
game.addRoom("room2", room2);

// Set starting location
game.player.current_room = "room1";

// Start the game
game.start();
```

## Example Games Included

### 1. Demo Game (Hardcoded)
A simple castle exploration game with 5 rooms, items, and interactions.
- Run without any config file to play this demo

### 2. The Enchanted Forest (game_config.json)
A more elaborate adventure through a mysterious forest with:
- 7 interconnected locations
- Multiple items to discover
- Usable items with special effects
- Quest elements

## Project Structure

```
FantasyLoopDev/
├── game_engine.py          # Python implementation
├── game_engine.js          # JavaScript implementation  
├── game_engine.ts          # TypeScript implementation
├── game_config.json        # Example game configuration
├── package.json            # Node.js package configuration
├── tsconfig.json           # TypeScript configuration
├── .gitignore             # Git ignore file
├── README.md              # This file
└── saves/                 # Game save files (auto-created)
```

## Core Classes

### Item
Represents objects in the game world.
- `name` - Item name
- `description` - Detailed description
- `usable` - Whether the item can be used
- `use_message` - Message displayed when used

### Room
Represents locations in the game.
- `name` - Room name
- `description` - Room description
- `exits` - Dictionary of direction -> room_id
- `items` - List of items in the room
- `visited` - Track if player has been here

### Player
Represents the player character.
- `name` - Player name
- `inventory` - List of items carried
- `health` - Current health points
- `max_health` - Maximum health
- `current_room` - Current location ID

### Game
Main engine managing game state.
- Handles all game logic
- Processes commands
- Manages save/load
- Controls game loop

## Advanced Features

### Save System
Games are saved as JSON files in the `saves/` directory. Save files contain:
- Complete player state (inventory, health, location)
- Room states (items, visited status)

### Command Parsing
The engine recognizes multiple variations of commands:
- `take sword` = `get sword` = `grab sword` = `pickup sword`
- `examine key` = `inspect key` = `x key`
- `north` = `n` = `go north`

### Extensibility
Easy to extend with:
- Combat systems
- NPCs (Non-Player Characters)
- Puzzles and quests
- Multiple endings
- Character stats and skills
- Random events

## Tips for Game Designers

1. **Start Small**: Begin with 3-5 rooms and gradually expand
2. **Use Descriptions**: Rich descriptions make the world come alive
3. **Item Placement**: Strategic item placement encourages exploration
4. **Test Often**: Play through your game frequently to find issues
5. **Balance**: Ensure there's always something to do or discover
6. **Save Points**: Remind players to save at important moments

## Contributing

Feel free to fork this project and create your own adventures! Some ideas:
- Add new command types
- Implement a combat system
- Add NPCs with dialogue
- Create puzzle mechanics
- Add time-based events
- Implement character progression

## License

MIT License - Feel free to use this for your own projects!

## Credits

Created as a flexible foundation for text-based adventure games. Perfect for learning game development, creating interactive stories, or just having fun!

---

**Have fun creating your own text adventures! 🎮✨**