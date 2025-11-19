import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface AnsWer {
    user: { name: string; initials: string };
    text: string;
    timeAgo: string;
  }
@Component({
  selector: 'answer-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './answer-card.html',
  styleUrl: './answer-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnswerCard {
  public answer = input<AnsWer>();
  public showButtons = input<boolean>(false);

  protected delete(): void {
    //TODO: implementar lógica de exclusão
    console.log('delete clicked');
  }
}
