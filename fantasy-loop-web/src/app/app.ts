import { Component } from '@angular/core';
import { GameTerminal } from './components/game-terminal/game-terminal';
import { InventoryPanel } from './components/inventory-panel/inventory-panel';
import { RoomPanel } from './components/room-panel/room-panel';

@Component({
  selector: 'app-root',
  imports: [GameTerminal, InventoryPanel, RoomPanel],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true
})
export class App {
  title = 'Fantasy Loop - Web Edition';
}
