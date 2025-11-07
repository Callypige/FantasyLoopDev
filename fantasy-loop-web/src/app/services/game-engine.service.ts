/**
 * Fantasy Loop - Game Engine Service for Angular
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Item, Room, Player, GameConfig, SaveData, GameMessage } from '../models/game.models';

@Injectable({
  providedIn: 'root'
})
export class GameEngineService {
  public player: Player = new Player();
  public rooms: Map<string, Room> = new Map();
  public game_title: string = "Fantasy Loop";
  public game_intro: string = "Welcome to the adventure!";

  private messagesSubject = new BehaviorSubject<GameMessage[]>([]);
  public messages$: Observable<GameMessage[]> = this.messagesSubject.asObservable();

  private playerSubject = new BehaviorSubject<Player>(this.player);
  public player$: Observable<Player> = this.playerSubject.asObservable();

  private currentRoomSubject = new BehaviorSubject<Room | null>(null);
  public currentRoom$: Observable<Room | null> = this.currentRoomSubject.asObservable();

  constructor() {
    this.initDemoGame();
  }

  addMessage(text: string, type: 'system' | 'info' | 'error' | 'success' | 'command' = 'info'): void {
    const messages = this.messagesSubject.value;
    messages.push({
      text,
      type,
      timestamp: new Date()
    });
    this.messagesSubject.next(messages);
  }

  clearMessages(): void {
    this.messagesSubject.next([]);
  }

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
      this.updateObservables();
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
      this.updateObservables();
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
        this.updateObservables();
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

    // Save command
    if (action === 'save') {
      const filename = parts.length > 1 ? parts[1] : "savegame";
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
  System: help/h, save [filename], load [filename]
`;
  }

  saveGame(filename: string): boolean {
    try {
      const saveData: SaveData = {
        player: this.player.toJSON(),
        rooms: {}
      };

      this.rooms.forEach((room, roomId) => {
        saveData.rooms[roomId] = room.toJSON();
      });

      localStorage.setItem(`fantasy-loop-save-${filename}`, JSON.stringify(saveData));
      return true;
    } catch (error) {
      console.error(`Error saving game: ${error}`);
      return false;
    }
  }

  loadGame(filename: string): boolean {
    try {
      const data = localStorage.getItem(`fantasy-loop-save-${filename}`);
      if (!data) {
        return false;
      }

      const saveData: SaveData = JSON.parse(data);

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

      this.updateObservables();
      return true;
    } catch (error) {
      console.error(`Error loading game: ${error}`);
      return false;
    }
  }

  loadFromConfig(config: GameConfig): void {
    this.game_title = config.title || 'Fantasy Loop';
    this.game_intro = config.intro || 'Welcome to the adventure!';

    // Clear existing rooms
    this.rooms.clear();

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

    this.updateObservables();
  }

  initDemoGame(): void {
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
    this.addRoom("entrance", entrance);
    this.addRoom("hall", hall);
    this.addRoom("tower", tower);
    this.addRoom("library", library);
    this.addRoom("garden", garden);

    this.player.current_room = "entrance";
    entrance.visited = true;

    this.game_title = "Fantasy Loop - Demo Adventure";
    this.game_intro = "Welcome, brave adventurer! Your quest begins at the ancient castle.";

    this.updateObservables();
  }

  private updateObservables(): void {
    this.playerSubject.next(this.player);
    this.currentRoomSubject.next(this.getCurrentRoom());
  }

  startGame(): void {
    this.clearMessages();
    this.addMessage(`${"=".repeat(60)}`, 'system');
    this.addMessage(this.game_title, 'system');
    this.addMessage(`${"=".repeat(60)}`, 'system');
    this.addMessage(this.game_intro, 'info');
    this.addMessage("\nType 'help' for a list of commands.\n", 'info');
    this.addMessage(this.look(), 'info');
  }

  executeCommand(command: string): void {
    this.addMessage(`> ${command}`, 'command');
    const result = this.processCommand(command);
    this.addMessage(result, 'info');
  }
}
