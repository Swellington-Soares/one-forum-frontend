import { Component } from '@angular/core';
import { AnsWer, AnswerCard } from '../answer-card/answer-card';
import { NoAnswersCard } from '../no-answers-card/no-answers-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'answers-container',
  imports: [CommonModule, NoAnswersCard, AnswerCard],
  templateUrl: './answers-container.html',
  styleUrl: './answers-container.css',
})
export class AnswersContainer {
  answers: AnsWer[] = [];
}
