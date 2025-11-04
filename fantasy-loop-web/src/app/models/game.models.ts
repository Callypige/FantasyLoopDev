/**
 * Fantasy Loop - Game Models for Angular
 */

export interface ItemData {
  name: string;
  description: string;
  usable?: boolean;
  use_message?: string;
}

export interface RoomData {
  name: string;
  description: string;
  exits?: { [key: string]: string };
  items?: ItemData[];
  visited?: boolean;
}

export interface PlayerData {
  name: string;
  inventory: ItemData[];
  health: number;
  max_health: number;
  current_room: string;
}

export interface GameConfig {
  title?: string;
  intro?: string;
  start_room?: string;
  rooms: { [key: string]: RoomData };
}

export interface SaveData {
  player: PlayerData;
  rooms: { [key: string]: RoomData };
}

/**
 * Represents an item that can be picked up, used, or examined.
 */
export class Item {
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
export class Room {
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
export class Player {
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
 * Game message with type for styling
 */
export interface GameMessage {
  text: string;
  type: 'system' | 'info' | 'error' | 'success' | 'command';
  timestamp: Date;
}
