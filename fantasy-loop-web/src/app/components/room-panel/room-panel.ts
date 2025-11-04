import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from '../../services/game-engine.service';
import { Room } from '../../models/game.models';

@Component({
  selector: 'app-room-panel',
  imports: [CommonModule],
  templateUrl: './room-panel.html',
  styleUrl: './room-panel.scss',
  standalone: true
})
export class RoomPanel implements OnInit {
  currentRoom: Room | null = null;

  constructor(public gameEngine: GameEngineService) {}

  ngOnInit(): void {
    this.gameEngine.currentRoom$.subscribe(room => {
      this.currentRoom = room;
    });
  }

  getExits(): string[] {
    return this.currentRoom?.exits ? Object.keys(this.currentRoom.exits) : [];
  }

  takeItem(itemName: string): void {
    this.gameEngine.executeCommand(`take ${itemName}`);
  }

  examineItem(itemName: string): void {
    this.gameEngine.executeCommand(`examine ${itemName}`);
  }

  goDirection(direction: string): void {
    this.gameEngine.executeCommand(`go ${direction}`);
  }
}
