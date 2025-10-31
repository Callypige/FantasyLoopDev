# Quick Start Guide

This guide will help you get started with Fantasy Loop in just a few minutes!

## Choose Your Language

Fantasy Loop supports three programming languages with identical features:

### 🐍 Python (Easiest to get started)
**Best for:** Beginners, rapid prototyping, simple setup
```bash
python game_engine.py
```

### 🟨 JavaScript (Most portable)
**Best for:** Web developers, cross-platform compatibility
```bash
node game_engine.js
```

### 🔷 TypeScript (Best for larger projects)
**Best for:** Type safety, IDE support, maintainability
```bash
npm install
npm run start:ts
```

## 5-Minute Tutorial

### Step 1: Play the Demo Game

Try the built-in demo to understand how the game works:

```bash
# Python
python game_engine.py

# JavaScript/Node
node game_engine.js
```

### Step 2: Basic Commands

Once the game starts, try these commands:
```
look                    # See where you are
inventory              # Check what you're carrying
take sword             # Pick up the sword
north                  # Go north
examine key            # Look at an item closely
use sword              # Use an item
help                   # See all commands
quit                   # Exit the game
```

### Step 3: Create Your First Game

Create a file called `my_game.json`:

```json
{
  "title": "My First Adventure",
  "intro": "Your adventure begins...",
  "start_room": "home",
  "rooms": {
    "home": {
      "name": "Your Home",
      "description": "You are in your cozy cottage. There's a door to the north.",
      "exits": {
        "north": "forest"
      },
      "items": [
        {
          "name": "backpack",
          "description": "A sturdy leather backpack.",
          "usable": false
        }
      ]
    },
    "forest": {
      "name": "Dark Forest",
      "description": "Tall trees surround you. It's getting dark.",
      "exits": {
        "south": "home"
      },
      "items": [
        {
          "name": "torch",
          "description": "A wooden torch wrapped in cloth.",
          "usable": true,
          "use_message": "You light the torch. The forest brightens!"
        }
      ]
    }
  }
}
```

Rename the file to `game_config.json` and run the game again. Your custom game will load automatically!

## Common Patterns

### Creating Connected Rooms

Rooms connect through "exits":
```json
"room1": {
  "exits": {
    "north": "room2",
    "east": "room3"
  }
}
```

Remember to create the reverse exits if you want two-way travel:
```json
"room2": {
  "exits": {
    "south": "room1"
  }
}
```

### Making Items Usable

Items can have special effects when used:
```json
{
  "name": "potion",
  "description": "A red healing potion",
  "usable": true,
  "use_message": "You drink the potion and feel refreshed!"
}
```

### Item Types to Consider

- **Keys:** Items that unlock things
- **Tools:** Items that help solve puzzles
- **Consumables:** Items that can be used once
- **Quest items:** Important story items
- **Decorative:** Items that add atmosphere

## Save and Load

The game automatically creates a `saves/` folder for your save files.

```
save mysave           # Save to saves/mysave.sav
load mysave          # Load from saves/mysave.sav
```

## Tips for Your First Game

1. **Start with 3-5 rooms** - Don't overwhelm yourself
2. **Draw a map** - Sketch your world on paper first
3. **Test frequently** - Play through your game often
4. **Add details gradually** - Start simple, then enhance
5. **Use descriptive text** - Good descriptions make games fun!

## Example Game Flow

Here's a simple adventure flow:
1. Player starts at home
2. Finds a key in the garden
3. Uses key to unlock the cellar
4. Discovers a treasure in the cellar
5. Returns home victorious

This translates to 3 rooms (home, garden, cellar) connected with exits, plus items (key, treasure) placed strategically.

## Next Steps

- Read the full [README.md](README.md) for complete documentation
- Look at [game_config.json](game_config.json) for a more complex example
- Experiment with different room layouts
- Add more items with interesting descriptions
- Create puzzles using item combinations

## Getting Help

- Check the in-game `help` command
- Read through the example games
- Look at the test files (`test_game.py` or `test_game.js`) for examples
- Experiment! The worst that can happen is an error message

## Common Issues

**Q: My game won't load my config file**
A: Make sure the file is named exactly `game_config.json` and is in the same directory as the game engine.

**Q: How do I make items disappear when used?**
A: Currently, usable items stay in inventory. You can extend the code to remove them after use.

**Q: Can I have conditional exits?**
A: The basic engine doesn't support this, but you can extend it! Check the Game class in the engine.

**Q: How do I add NPCs or combat?**
A: These are advanced features you can add by extending the game classes. The engine provides a solid foundation.

---

**Ready to create your adventure? Start simple, test often, and have fun! 🎮✨**
