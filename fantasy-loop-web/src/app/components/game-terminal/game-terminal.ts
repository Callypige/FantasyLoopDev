import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameEngineService } from '../../services/game-engine.service';
import { GameMessage } from '../../models/game.models';

@Component({
  selector: 'app-game-terminal',
  imports: [CommonModule, FormsModule],
  templateUrl: './game-terminal.html',
  styleUrl: './game-terminal.scss',
  standalone: true
})
export class GameTerminal implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: GameMessage[] = [];
  currentCommand: string = '';
  commandHistory: string[] = [];
  historyIndex: number = -1;

  constructor(public gameEngine: GameEngineService) {}

  ngOnInit(): void {
    this.gameEngine.messages$.subscribe(messages => {
      this.messages = messages;
    });
    this.gameEngine.startGame();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  onSubmit(): void {
    if (this.currentCommand.trim()) {
      this.commandHistory.push(this.currentCommand);
      this.historyIndex = this.commandHistory.length;
      this.gameEngine.executeCommand(this.currentCommand);
      this.currentCommand = '';
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.currentCommand = this.commandHistory[this.historyIndex];
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
        this.currentCommand = this.commandHistory[this.historyIndex];
      } else {
        this.historyIndex = this.commandHistory.length;
        this.currentCommand = '';
      }
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }
}
