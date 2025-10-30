# Example Games

This directory contains example game configurations to help you learn and get inspired!

## Available Examples

### 1. The Enchanted Forest (../game_config.json)
**Genre:** Fantasy Adventure  
**Rooms:** 7  
**Difficulty:** Beginner-Friendly

A mystical forest adventure with magical items and mysterious locations. Great for learning the basics of the engine.

**To play:**
```bash
# The main game_config.json file
python game_engine.py  # or node game_engine.js
```

### 2. The Mystery House (mystery_house.json)
**Genre:** Mystery/Horror  
**Rooms:** 8  
**Difficulty:** Intermediate

You've inherited a spooky old house. Explore rooms, find clues, and uncover the dark secrets hidden within.

**Features:**
- Multiple floors to explore
- Clue-based puzzle elements
- Atmospheric horror setting
- Hidden items and secrets

**To play:**
```bash
# Copy to main directory first
cp examples/mystery_house.json game_config.json
python game_engine.py
```

### 3. Space Station Alpha (space_station.json)
**Genre:** Science Fiction  
**Rooms:** 7  
**Difficulty:** Intermediate

Wake up from cryo-sleep on an abandoned space station. Something went wrong, and you need to figure out what happened while restoring critical systems.

**Features:**
- Sci-fi setting with technical elements
- System repair mechanics (through items)
- Mystery storyline
- Technical equipment and tools

**To play:**
```bash
# Copy to main directory first
cp examples/space_station.json game_config.json
node game_engine.js
```

## Using These Examples

### Method 1: Copy to Main Directory
```bash
cp examples/mystery_house.json game_config.json
python game_engine.py
```

### Method 2: Load Programmatically (Python)
```python
from game_engine import Game

game = Game()
game.load_from_config("examples/mystery_house.json")
game.start()
```

### Method 3: Load Programmatically (JavaScript)
```javascript
const { Game } = require('./game_engine');

const game = new Game();
game.loadFromConfig("examples/mystery_house.json");
game.start();
```

## Learning from Examples

### For Beginners
Start with **The Enchanted Forest** - it demonstrates:
- Basic room connections
- Simple item interactions
- Clear navigation paths
- Good item descriptions

### For Intermediate Users
Try **The Mystery House** or **Space Station Alpha** to learn:
- Multi-level/floor navigation
- Thematic item placement
- Building atmosphere through descriptions
- Creating puzzle-like elements

## Creating Your Own

Use these examples as templates:

1. **Copy an example** that matches your desired genre
2. **Modify the descriptions** to match your story
3. **Rearrange rooms** to create your layout
4. **Add/remove items** to fit your narrative
5. **Test frequently** to ensure everything works

## Example Patterns

### Pattern 1: Linear Adventure
```
Room A → Room B → Room C → Room D
```
*Good for: Storylines, tutorials, guided experiences*

### Pattern 2: Hub and Spoke
```
        Room B
          ↑
Room C ← Hub → Room D
          ↓
        Room E
```
*Good for: Exploration, giving players choices*
*Used in: The Enchanted Forest*

### Pattern 3: Multi-Level
```
Upper Floor: Room A ⟷ Room B
      ↕              ↕
Lower Floor: Room C ⟷ Room D
```
*Good for: Buildings, complex locations*
*Used in: The Mystery House*

## Tips for Using Examples

1. **Start by playing them** - Understand the experience first
2. **Read the JSON** - See how rooms and items are structured
3. **Make small changes** - Modify one thing at a time
4. **Keep backups** - Save copies before major changes
5. **Mix and match** - Combine ideas from different examples

## Contributing Examples

Have a great game you'd like to share? Consider these guidelines:
- Keep it family-friendly (for public examples)
- Include 5-10 rooms for completeness
- Add interesting item interactions
- Write engaging descriptions
- Test thoroughly before sharing

---

**Ready to explore? Pick an example and start your adventure! 🎮✨**
