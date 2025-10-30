/**
 * Fantasy Loop - Text-Based Game Engine (TypeScript)
 * 
 * A flexible text-based game engine for creating interactive fiction and adventure games.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

interface ItemData {
    name: string;
    description: string;
    usable?: boolean;
    use_message?: string;
}

interface RoomData {
    name: string;
    description: string;
    exits?: { [key: string]: string };
    items?: ItemData[];
    visited?: boolean;
}

interface PlayerData {
    name: string;
    inventory: ItemData[];
    health: number;
    max_health: number;
    current_room: string;
}

interface GameConfig {
    title?: string;
    intro?: string;
    start_room?: string;
    rooms: { [key: string]: RoomData };
}

interface SaveData {
    player: PlayerData;
    rooms: { [key: string]: RoomData };
}

/**
 * Represents an item that can be picked up, used, or examined.
 */
class Item {
    constructor(
        public name: string,
        public description: string,
        public usable: boolean = false,
        public use_message: string = ""
    ) {}

    toJSON(): ItemData {
        return {
            name: this.name,
            description: this.description,
            usable: this.usable,
            use_message: this.use_message
        };
    }

    static fromJSON(data: ItemData): Item {
        return new Item(
            data.name,
            data.description,
            data.usable || false,
            data.use_message || ""
        );
    }
}

/**
 * Represents a location in the game world.
 */
class Room {
    public visited: boolean = false;

    constructor(
        public name: string,
        public description: string,
        public exits: { [key: string]: string } = {},
        public items: Item[] = []
    ) {}

    addExit(direction: string, roomId: string): void {
        this.exits[direction] = roomId;
    }

    addItem(item: Item): void {
        this.items.push(item);
    }

    removeItem(itemName: string): Item | null {
        const index = this.items.findIndex(
            item => item.name.toLowerCase() === itemName.toLowerCase()
        );
        if (index !== -1) {
            return this.items.splice(index, 1)[0];
        }
        return null;
    }

    getItem(itemName: string): Item | null {
        return this.items.find(
            item => item.name.toLowerCase() === itemName.toLowerCase()
        ) || null;
    }

    toJSON(): RoomData {
        return {
            name: this.name,
            description: this.description,
            exits: this.exits,
            items: this.items.map(item => item.toJSON()),
            visited: this.visited
        };
    }
}

/**
 * Represents the player character.
 */
class Player {
    public inventory: Item[] = [];
    public health: number = 100;
    public max_health: number = 100;
    public current_room: string = "start";

    constructor(public name: string = "Hero") {}

    addItem(item: Item): void {
        this.inventory.push(item);
    }

    removeItem(itemName: string): Item | null {
        const index = this.inventory.findIndex(
            item => item.name.toLowerCase() === itemName.toLowerCase()
        );
        if (index !== -1) {
            return this.inventory.splice(index, 1)[0];
        }
        return null;
    }

    hasItem(itemName: string): boolean {
        return this.inventory.some(
            item => item.name.toLowerCase() === itemName.toLowerCase()
        );
    }

    getItem(itemName: string): Item | null {
        return this.inventory.find(
            item => item.name.toLowerCase() === itemName.toLowerCase()
        ) || null;
    }

    toJSON(): PlayerData {
        return {
            name: this.name,
            inventory: this.inventory.map(item => item.toJSON()),
            health: this.health,
            max_health: this.max_health,
            current_room: this.current_room
        };
    }
}

/**
 * Main game engine that manages the game state and logic.
 */
class Game {
    public player: Player = new Player();
    public rooms: Map<string, Room> = new Map();
    public running: boolean = false;
    public game_title: string = "Fantasy Loop";
    public game_intro: string = "Welcome to the adventure!";
    private rl: readline.Interface | null = null;

    addRoom(roomId: string, room: Room): void {
        this.rooms.set(roomId, room);
    }

    getCurrentRoom(): Room | null {
        return this.rooms.get(this.player.current_room) || null;
    }

    movePlayer(direction: string): boolean {
        const currentRoom = this.getCurrentRoom();
        if (!currentRoom) {
            return false;
        }

        const newRoomId = currentRoom.exits[direction.toLowerCase()];
        if (newRoomId) {
            this.player.current_room = newRoomId;
            const newRoom = this.getCurrentRoom();
            if (newRoom) {
                newRoom.visited = true;
            }
            return true;
        }
        return false;
    }

    look(): string {
        const room = this.getCurrentRoom();
        if (!room) {
            return "You are nowhere.";
        }

        let output = `\n${room.name}\n${"=".repeat(room.name.length)}\n${room.description}\n`;

        if (room.items.length > 0) {
            output += "\nYou can see:\n";
            room.items.forEach(item => {
                output += `  - ${item.name}\n`;
            });
        }

        if (Object.keys(room.exits).length > 0) {
            output += "\nExits: " + Object.keys(room.exits).join(", ") + "\n";
        }

        return output;
    }

    takeItem(itemName: string): string {
        const room = this.getCurrentRoom();
        if (!room) {
            return "You are nowhere.";
        }

        const item = room.removeItem(itemName);
        if (item) {
            this.player.addItem(item);
            return `You took the ${item.name}.`;
        }
        return `There is no '${itemName}' here.`;
    }

    dropItem(itemName: string): string {
        const item = this.player.removeItem(itemName);
        if (item) {
            const room = this.getCurrentRoom();
            if (room) {
                room.addItem(item);
                return `You dropped the ${item.name}.`;
            }
        }
        return `You don't have '${itemName}'.`;
    }

    examineItem(itemName: string): string {
        // Check inventory first
        let item = this.player.getItem(itemName);
        if (item) {
            return item.description;
        }

        // Check room
        const room = this.getCurrentRoom();
        if (room) {
            item = room.getItem(itemName);
            if (item) {
                return item.description;
            }
        }

        return `You don't see any '${itemName}' here.`;
    }

    useItem(itemName: string): string {
        const item = this.player.getItem(itemName);
        if (!item) {
            return `You don't have '${itemName}'.`;
        }

        if (!item.usable) {
            return `You can't use the ${item.name}.`;
        }

        return item.use_message;
    }

    showInventory(): string {
        if (this.player.inventory.length === 0) {
            return "Your inventory is empty.";
        }

        let output = "Inventory:\n";
        this.player.inventory.forEach(item => {
            output += `  - ${item.name}\n`;
        });
        return output;
    }

    showStatus(): string {
        return `\n${this.player.name}\nHealth: ${this.player.health}/${this.player.max_health}\n`;
    }

    processCommand(command: string): string {
        command = command.trim().toLowerCase();
        const parts = command.split(/\s+/);

        if (parts.length === 0 || parts[0] === '') {
            return "Please enter a command.";
        }

        const action = parts[0];

        // Movement commands
        if (action === 'go' || action === 'move' || action === 'walk') {
            if (parts.length < 2) {
                return "Go where?";
            }
            const direction = parts[1];
            if (this.movePlayer(direction)) {
                return this.look();
            }
            return "You can't go that way.";
        }

        // Direction shortcuts
        const directions = ['north', 'south', 'east', 'west', 'n', 's', 'e', 'w',
                          'up', 'down', 'northeast', 'northwest', 'southeast', 'southwest'];
        if (directions.includes(action)) {
            if (this.movePlayer(action)) {
                return this.look();
            }
            return "You can't go that way.";
        }

        // Look command
        if (action === 'look' || action === 'l') {
            return this.look();
        }

        // Take/get command
        if (action === 'take' || action === 'get' || action === 'grab' || action === 'pickup') {
            if (parts.length < 2) {
                return "Take what?";
            }
            const itemName = parts.slice(1).join(" ");
            return this.takeItem(itemName);
        }

        // Drop command
        if (action === 'drop' || action === 'put') {
            if (parts.length < 2) {
                return "Drop what?";
            }
            const itemName = parts.slice(1).join(" ");
            return this.dropItem(itemName);
        }

        // Examine command
        if (action === 'examine' || action === 'inspect' || action === 'ex' || action === 'x') {
            if (parts.length < 2) {
                return "Examine what?";
            }
            const itemName = parts.slice(1).join(" ");
            return this.examineItem(itemName);
        }

        // Use command
        if (action === 'use') {
            if (parts.length < 2) {
                return "Use what?";
            }
            const itemName = parts.slice(1).join(" ");
            return this.useItem(itemName);
        }

        // Inventory command
        if (action === 'inventory' || action === 'inv' || action === 'i') {
            return this.showInventory();
        }

        // Status command
        if (action === 'status' || action === 'stats') {
            return this.showStatus();
        }

        // Help command
        if (action === 'help' || action === 'h' || action === '?') {
            return this.showHelp();
        }

        // Quit command
        if (action === 'quit' || action === 'exit' || action === 'q') {
            this.running = false;
            return "Thanks for playing!";
        }

        // Save command
        if (action === 'save') {
            const filename = parts.length > 1 ? parts[1] : "savegame.sav";
            if (this.saveGame(filename)) {
                return `Game saved to ${filename}`;
            }
            return "Failed to save game.";
        }

        // Load command
        if (action === 'load') {
            if (parts.length < 2) {
                return "Load which file?";
            }
            if (this.loadGame(parts[1])) {
                return `Game loaded from ${parts[1]}\n\n${this.look()}`;
            }
            return "Failed to load game.";
        }

        return "I don't understand that command. Type 'help' for a list of commands.";
    }

    showHelp(): string {
        return `
Available Commands:
  Movement: go [direction], north/n, south/s, east/e, west/w
  Actions: take [item], drop [item], examine [item], use [item]
  Info: look/l, inventory/inv/i, status
  System: help/h, save [filename], load [filename], quit/q
`;
    }

    saveGame(filename: string): boolean {
        try {
            const saveDir = "saves";
            if (!fs.existsSync(saveDir)) {
                fs.mkdirSync(saveDir, { recursive: true });
            }
            const filepath = path.join(saveDir, filename);

            const saveData: SaveData = {
                player: this.player.toJSON(),
                rooms: {}
            };

            this.rooms.forEach((room, roomId) => {
                saveData.rooms[roomId] = room.toJSON();
            });

            fs.writeFileSync(filepath, JSON.stringify(saveData, null, 2));
            return true;
        } catch (error) {
            console.error(`Error saving game: ${error}`);
            return false;
        }
    }

    loadGame(filename: string): boolean {
        try {
            const saveDir = "saves";
            const filepath = path.join(saveDir, filename);

            const saveData: SaveData = JSON.parse(fs.readFileSync(filepath, 'utf-8'));

            // Restore player
            const playerData = saveData.player;
            this.player.name = playerData.name;
            this.player.health = playerData.health;
            this.player.max_health = playerData.max_health;
            this.player.current_room = playerData.current_room;
            this.player.inventory = playerData.inventory.map(item => Item.fromJSON(item));

            // Restore rooms (only update visited status and items)
            Object.entries(saveData.rooms).forEach(([roomId, roomData]) => {
                const room = this.rooms.get(roomId);
                if (room) {
                    room.visited = roomData.visited || false;
                    room.items = (roomData.items || []).map(item => Item.fromJSON(item));
                }
            });

            return true;
        } catch (error) {
            console.error(`Error loading game: ${error}`);
            return false;
        }
    }

    loadFromConfig(configFile: string): void {
        try {
            const config: GameConfig = JSON.parse(fs.readFileSync(configFile, 'utf-8'));

            this.game_title = config.title || 'Fantasy Loop';
            this.game_intro = config.intro || 'Welcome to the adventure!';

            // Load rooms
            Object.entries(config.rooms).forEach(([roomId, roomData]) => {
                const items = (roomData.items || []).map(itemData =>
                    new Item(
                        itemData.name,
                        itemData.description,
                        itemData.usable || false,
                        itemData.use_message || ""
                    )
                );

                const room = new Room(
                    roomData.name,
                    roomData.description,
                    roomData.exits || {},
                    items
                );
                this.addRoom(roomId, room);
            });

            // Set starting room
            this.player.current_room = config.start_room || 'start';

            // Mark starting room as visited
            const startRoom = this.getCurrentRoom();
            if (startRoom) {
                startRoom.visited = true;
            }
        } catch (error) {
            console.error(`Error loading configuration: ${error}`);
        }
    }

    async start(): Promise<void> {
        console.log(`\n${"=".repeat(60)}`);
        console.log(this.game_title.padStart((60 + this.game_title.length) / 2));
        console.log(`${"=".repeat(60)}\n`);
        console.log(this.game_intro);
        console.log("\nType 'help' for a list of commands.\n");
        console.log(this.look());

        this.running = true;

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const promptUser = () => {
            if (!this.running) {
                this.rl?.close();
                return;
            }

            this.rl?.question("\n> ", (command: string) => {
                if (command.trim()) {
                    const result = this.processCommand(command);
                    console.log(result);
                }
                promptUser();
            });
        };

        promptUser();
    }
}

/**
 * Create a demo game for testing.
 */
function createDemoGame(): Game {
    const game = new Game();

    // Create rooms
    const entrance = new Room(
        "Castle Entrance",
        "You stand before a massive stone castle. The entrance gate is open, inviting you inside.",
        { "north": "hall", "east": "garden" }
    );
    entrance.addItem(new Item(
        "sword",
        "A sturdy iron sword, well-balanced and sharp.",
        true,
        "You swing the sword through the air. It feels good in your hand."
    ));

    const hall = new Room(
        "Great Hall",
        "A vast hall with high ceilings and ancient tapestries on the walls. A grand staircase leads upward.",
        { "south": "entrance", "up": "tower", "west": "library" }
    );
    hall.addItem(new Item("key", "A rusty old key with strange markings."));

    const tower = new Room(
        "Tower Chamber",
        "At the top of the tower, you have a magnificent view of the surrounding lands. A treasure chest sits in the corner.",
        { "down": "hall" }
    );
    tower.addItem(new Item("treasure", "A chest filled with glittering gold coins!"));

    const library = new Room(
        "Ancient Library",
        "Shelves upon shelves of dusty old books surround you. The air smells of aged paper.",
        { "east": "hall" }
    );
    library.addItem(new Item(
        "book",
        "An ancient tome with magical symbols on the cover. It radiates a faint blue glow.",
        true,
        "You open the book and feel a surge of magical energy!"
    ));

    const garden = new Room(
        "Castle Garden",
        "A beautiful garden with exotic flowers and a small fountain. The sound of water is soothing.",
        { "west": "entrance" }
    );
    garden.addItem(new Item("flower", "A rare blue rose with an enchanting fragrance."));

    // Add rooms to game
    game.addRoom("entrance", entrance);
    game.addRoom("hall", hall);
    game.addRoom("tower", tower);
    game.addRoom("library", library);
    game.addRoom("garden", garden);

    game.player.current_room = "entrance";
    entrance.visited = true;

    game.game_title = "Fantasy Loop - Demo Adventure";
    game.game_intro = "Welcome, brave adventurer! Your quest begins at the ancient castle.";

    return game;
}

// Main execution
if (require.main === module) {
    (async () => {
        let game: Game;

        if (fs.existsSync("game_config.json")) {
            game = new Game();
            game.loadFromConfig("game_config.json");
        } else {
            game = createDemoGame();
        }

        await game.start();
    })();
}

export { Game, Player, Room, Item, createDemoGame };
