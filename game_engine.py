"""
Fantasy Loop - Text-Based Game Engine (Python)

A flexible text-based game engine for creating interactive fiction and adventure games.
"""

import json
import os
from typing import Dict, List, Optional, Any


class Item:
    """Represents an item that can be picked up, used, or examined."""
    
    def __init__(self, name: str, description: str, usable: bool = False, use_message: str = ""):
        self.name = name
        self.description = description
        self.usable = usable
        self.use_message = use_message
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert item to dictionary for saving."""
        return {
            'name': self.name,
            'description': self.description,
            'usable': self.usable,
            'use_message': self.use_message
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Item':
        """Create item from dictionary."""
        return cls(
            data['name'],
            data['description'],
            data.get('usable', False),
            data.get('use_message', '')
        )


class Room:
    """Represents a location in the game world."""
    
    def __init__(self, name: str, description: str, exits: Optional[Dict[str, str]] = None, 
                 items: Optional[List[Item]] = None):
        self.name = name
        self.description = description
        self.exits = exits or {}
        self.items = items or []
        self.visited = False
    
    def add_exit(self, direction: str, room_id: str):
        """Add an exit to another room."""
        self.exits[direction] = room_id
    
    def add_item(self, item: Item):
        """Add an item to the room."""
        self.items.append(item)
    
    def remove_item(self, item_name: str) -> Optional[Item]:
        """Remove and return an item from the room."""
        for i, item in enumerate(self.items):
            if item.name.lower() == item_name.lower():
                return self.items.pop(i)
        return None
    
    def get_item(self, item_name: str) -> Optional[Item]:
        """Get an item without removing it."""
        for item in self.items:
            if item.name.lower() == item_name.lower():
                return item
        return None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert room to dictionary for saving."""
        return {
            'name': self.name,
            'description': self.description,
            'exits': self.exits,
            'items': [item.to_dict() for item in self.items],
            'visited': self.visited
        }


class Player:
    """Represents the player character."""
    
    def __init__(self, name: str = "Hero"):
        self.name = name
        self.inventory: List[Item] = []
        self.health = 100
        self.max_health = 100
        self.current_room = "start"
    
    def add_item(self, item: Item):
        """Add an item to inventory."""
        self.inventory.append(item)
    
    def remove_item(self, item_name: str) -> Optional[Item]:
        """Remove and return an item from inventory."""
        for i, item in enumerate(self.inventory):
            if item.name.lower() == item_name.lower():
                return self.inventory.pop(i)
        return None
    
    def has_item(self, item_name: str) -> bool:
        """Check if player has an item."""
        return any(item.name.lower() == item_name.lower() for item in self.inventory)
    
    def get_item(self, item_name: str) -> Optional[Item]:
        """Get an item from inventory."""
        for item in self.inventory:
            if item.name.lower() == item_name.lower():
                return item
        return None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert player to dictionary for saving."""
        return {
            'name': self.name,
            'inventory': [item.to_dict() for item in self.inventory],
            'health': self.health,
            'max_health': self.max_health,
            'current_room': self.current_room
        }


class Game:
    """Main game engine that manages the game state and logic."""
    
    def __init__(self):
        self.player = Player()
        self.rooms: Dict[str, Room] = {}
        self.running = False
        self.game_title = "Fantasy Loop"
        self.game_intro = "Welcome to the adventure!"
    
    def add_room(self, room_id: str, room: Room):
        """Add a room to the game world."""
        self.rooms[room_id] = room
    
    def get_current_room(self) -> Optional[Room]:
        """Get the room the player is currently in."""
        return self.rooms.get(self.player.current_room)
    
    def move_player(self, direction: str) -> bool:
        """Move player in a direction. Returns True if successful."""
        current_room = self.get_current_room()
        if not current_room:
            return False
        
        if direction.lower() in current_room.exits:
            self.player.current_room = current_room.exits[direction.lower()]
            new_room = self.get_current_room()
            if new_room:
                new_room.visited = True
            return True
        return False
    
    def look(self) -> str:
        """Get description of current room."""
        room = self.get_current_room()
        if not room:
            return "You are nowhere."
        
        output = f"\n{room.name}\n{'=' * len(room.name)}\n{room.description}\n"
        
        if room.items:
            output += "\nYou can see:\n"
            for item in room.items:
                output += f"  - {item.name}\n"
        
        if room.exits:
            output += "\nExits: " + ", ".join(room.exits.keys()) + "\n"
        
        return output
    
    def take_item(self, item_name: str) -> str:
        """Take an item from the current room."""
        room = self.get_current_room()
        if not room:
            return "You are nowhere."
        
        item = room.remove_item(item_name)
        if item:
            self.player.add_item(item)
            return f"You took the {item.name}."
        return f"There is no '{item_name}' here."
    
    def drop_item(self, item_name: str) -> str:
        """Drop an item from inventory into current room."""
        item = self.player.remove_item(item_name)
        if item:
            room = self.get_current_room()
            if room:
                room.add_item(item)
                return f"You dropped the {item.name}."
        return f"You don't have '{item_name}'."
    
    def examine_item(self, item_name: str) -> str:
        """Examine an item in inventory or room."""
        # Check inventory first
        item = self.player.get_item(item_name)
        if item:
            return item.description
        
        # Check room
        room = self.get_current_room()
        if room:
            item = room.get_item(item_name)
            if item:
                return item.description
        
        return f"You don't see any '{item_name}' here."
    
    def use_item(self, item_name: str) -> str:
        """Use an item from inventory."""
        item = self.player.get_item(item_name)
        if not item:
            return f"You don't have '{item_name}'."
        
        if not item.usable:
            return f"You can't use the {item.name}."
        
        return item.use_message
    
    def show_inventory(self) -> str:
        """Show player's inventory."""
        if not self.player.inventory:
            return "Your inventory is empty."
        
        output = "Inventory:\n"
        for item in self.player.inventory:
            output += f"  - {item.name}\n"
        return output
    
    def show_status(self) -> str:
        """Show player's status."""
        return f"\n{self.player.name}\nHealth: {self.player.health}/{self.player.max_health}\n"
    
    def process_command(self, command: str) -> str:
        """Process a player command and return the result."""
        command = command.strip().lower()
        parts = command.split()
        
        if not parts:
            return "Please enter a command."
        
        action = parts[0]
        
        # Movement commands
        if action in ['go', 'move', 'walk']:
            if len(parts) < 2:
                return "Go where?"
            direction = parts[1]
            if self.move_player(direction):
                return self.look()
            return "You can't go that way."
        
        # Direction shortcuts
        if action in ['north', 'south', 'east', 'west', 'n', 's', 'e', 'w',
                      'up', 'down', 'northeast', 'northwest', 'southeast', 'southwest']:
            if self.move_player(action):
                return self.look()
            return "You can't go that way."
        
        # Look command
        if action in ['look', 'l']:
            return self.look()
        
        # Take/get command
        if action in ['take', 'get', 'grab', 'pickup']:
            if len(parts) < 2:
                return "Take what?"
            item_name = " ".join(parts[1:])
            return self.take_item(item_name)
        
        # Drop command
        if action in ['drop', 'put']:
            if len(parts) < 2:
                return "Drop what?"
            item_name = " ".join(parts[1:])
            return self.drop_item(item_name)
        
        # Examine command
        if action in ['examine', 'inspect', 'ex', 'x']:
            if len(parts) < 2:
                return "Examine what?"
            item_name = " ".join(parts[1:])
            return self.examine_item(item_name)
        
        # Use command
        if action in ['use']:
            if len(parts) < 2:
                return "Use what?"
            item_name = " ".join(parts[1:])
            return self.use_item(item_name)
        
        # Inventory command
        if action in ['inventory', 'inv', 'i']:
            return self.show_inventory()
        
        # Status command
        if action in ['status', 'stats']:
            return self.show_status()
        
        # Help command
        if action in ['help', 'h', '?']:
            return self.show_help()
        
        # Quit command
        if action in ['quit', 'exit', 'q']:
            self.running = False
            return "Thanks for playing!"
        
        # Save command
        if action in ['save']:
            filename = parts[1] if len(parts) > 1 else "savegame.sav"
            if self.save_game(filename):
                return f"Game saved to {filename}"
            return "Failed to save game."
        
        # Load command
        if action in ['load']:
            if len(parts) < 2:
                return "Load which file?"
            if self.load_game(parts[1]):
                return f"Game loaded from {parts[1]}\n\n" + self.look()
            return "Failed to load game."
        
        return "I don't understand that command. Type 'help' for a list of commands."
    
    def show_help(self) -> str:
        """Show help text."""
        return """
Available Commands:
  Movement: go [direction], north/n, south/s, east/e, west/w
  Actions: take [item], drop [item], examine [item], use [item]
  Info: look/l, inventory/inv/i, status
  System: help/h, save [filename], load [filename], quit/q
"""
    
    def save_game(self, filename: str) -> bool:
        """Save the game state to a file."""
        try:
            save_dir = "saves"
            os.makedirs(save_dir, exist_ok=True)
            filepath = os.path.join(save_dir, filename)
            
            save_data = {
                'player': self.player.to_dict(),
                'rooms': {room_id: room.to_dict() for room_id, room in self.rooms.items()}
            }
            
            with open(filepath, 'w') as f:
                json.dump(save_data, f, indent=2)
            return True
        except Exception as e:
            print(f"Error saving game: {e}")
            return False
    
    def load_game(self, filename: str) -> bool:
        """Load the game state from a file."""
        try:
            save_dir = "saves"
            filepath = os.path.join(save_dir, filename)
            
            with open(filepath, 'r') as f:
                save_data = json.load(f)
            
            # Restore player
            player_data = save_data['player']
            self.player.name = player_data['name']
            self.player.health = player_data['health']
            self.player.max_health = player_data['max_health']
            self.player.current_room = player_data['current_room']
            self.player.inventory = [Item.from_dict(item) for item in player_data['inventory']]
            
            # Restore rooms (only update visited status and items)
            for room_id, room_data in save_data['rooms'].items():
                if room_id in self.rooms:
                    self.rooms[room_id].visited = room_data['visited']
                    self.rooms[room_id].items = [Item.from_dict(item) for item in room_data['items']]
            
            return True
        except Exception as e:
            print(f"Error loading game: {e}")
            return False
    
    def load_from_config(self, config_file: str):
        """Load game configuration from a JSON file."""
        try:
            with open(config_file, 'r') as f:
                config = json.load(f)
            
            self.game_title = config.get('title', 'Fantasy Loop')
            self.game_intro = config.get('intro', 'Welcome to the adventure!')
            
            # Load rooms
            for room_id, room_data in config.get('rooms', {}).items():
                items = [Item(
                    item['name'],
                    item['description'],
                    item.get('usable', False),
                    item.get('use_message', '')
                ) for item in room_data.get('items', [])]
                
                room = Room(
                    room_data['name'],
                    room_data['description'],
                    room_data.get('exits', {}),
                    items
                )
                self.add_room(room_id, room)
            
            # Set starting room
            self.player.current_room = config.get('start_room', 'start')
            
            # Mark starting room as visited
            start_room = self.get_current_room()
            if start_room:
                start_room.visited = True
            
        except Exception as e:
            print(f"Error loading configuration: {e}")
    
    def start(self):
        """Start the game loop."""
        print(f"\n{'=' * 60}")
        print(f"{self.game_title.center(60)}")
        print(f"{'=' * 60}\n")
        print(self.game_intro)
        print("\nType 'help' for a list of commands.\n")
        print(self.look())
        
        self.running = True
        
        while self.running:
            try:
                command = input("\n> ").strip()
                if command:
                    result = self.process_command(command)
                    print(result)
            except KeyboardInterrupt:
                print("\n\nGame interrupted.")
                self.running = False
            except EOFError:
                print("\n\nGame ended.")
                self.running = False


def create_demo_game() -> Game:
    """Create a demo game for testing."""
    game = Game()
    
    # Create rooms
    entrance = Room(
        "Castle Entrance",
        "You stand before a massive stone castle. The entrance gate is open, inviting you inside.",
        {"north": "hall", "east": "garden"}
    )
    entrance.add_item(Item("sword", "A sturdy iron sword, well-balanced and sharp.", True, 
                           "You swing the sword through the air. It feels good in your hand."))
    
    hall = Room(
        "Great Hall",
        "A vast hall with high ceilings and ancient tapestries on the walls. " +
        "A grand staircase leads upward.",
        {"south": "entrance", "up": "tower", "west": "library"}
    )
    hall.add_item(Item("key", "A rusty old key with strange markings.", False))
    
    tower = Room(
        "Tower Chamber",
        "At the top of the tower, you have a magnificent view of the surrounding lands. " +
        "A treasure chest sits in the corner.",
        {"down": "hall"}
    )
    tower.add_item(Item("treasure", "A chest filled with glittering gold coins!", False))
    
    library = Room(
        "Ancient Library",
        "Shelves upon shelves of dusty old books surround you. The air smells of aged paper.",
        {"east": "hall"}
    )
    library.add_item(Item("book", "An ancient tome with magical symbols on the cover. " +
                          "It radiates a faint blue glow.", True,
                          "You open the book and feel a surge of magical energy!"))
    
    garden = Room(
        "Castle Garden",
        "A beautiful garden with exotic flowers and a small fountain. " +
        "The sound of water is soothing.",
        {"west": "entrance"}
    )
    garden.add_item(Item("flower", "A rare blue rose with an enchanting fragrance.", False))
    
    # Add rooms to game
    game.add_room("entrance", entrance)
    game.add_room("hall", hall)
    game.add_room("tower", tower)
    game.add_room("library", library)
    game.add_room("garden", garden)
    
    game.player.current_room = "entrance"
    entrance.visited = True
    
    game.game_title = "Fantasy Loop - Demo Adventure"
    game.game_intro = "Welcome, brave adventurer! Your quest begins at the ancient castle."
    
    return game


if __name__ == "__main__":
    # Check if there's a config file
    if os.path.exists("game_config.json"):
        game = Game()
        game.load_from_config("game_config.json")
    else:
        game = create_demo_game()
    
    game.start()
