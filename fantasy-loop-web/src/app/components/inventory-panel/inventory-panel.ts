import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from '../../services/game-engine.service';
import { Player } from '../../models/game.models';

@Component({
  selector: 'app-inventory-panel',
  imports: [CommonModule],
  templateUrl: './inventory-panel.html',
  styleUrl: './inventory-panel.scss',
  standalone: true
})
export class InventoryPanel implements OnInit {
  player: Player | null = null;

  constructor(public gameEngine: GameEngineService) {}

  ngOnInit(): void {
    this.gameEngine.player$.subscribe(player => {
      this.player = player;
    });
  }

  examineItem(itemName: string): void {
    this.gameEngine.executeCommand(`examine ${itemName}`);
  }

  useItem(itemName: string): void {
    this.gameEngine.executeCommand(`use ${itemName}`);
  }

  dropItem(itemName: string): void {
    this.gameEngine.executeCommand(`drop ${itemName}`);
  }
}
