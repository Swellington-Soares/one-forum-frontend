import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Topic } from '../../../../core/models/topics';

@Component({
  selector: 'topic-card',
  imports: [MatCardModule, MatButtonModule, MatChipsModule, MatIconModule, CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './topic-card.html',
  styleUrl: './topic-card.css',
})
export class TopicCard {
  public topic = input.required<Topic>(); 

  
  toggleLike() {
  console.log("AAAAAAAAAAAAAAAAAAAA", this.topic())
    // TODO: implementar lógica de curtir/descurtir
  }
}
