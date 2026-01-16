import { Component, effect, Input, input, output } from '@angular/core';
import { CommentCard } from '../comment-card/comment-card';
import { NoCommentsCard } from '../no-comments-card/no-comments-card';

import { Comment } from '../../../../core/models/comments';

@Component({
  selector: 'comments-container',
  imports: [NoCommentsCard, CommentCard],
  templateUrl: './comments-container.html',
  styleUrl: './comments-container.css',
})
export class CommentsContainer {
  public comments = input<Comment[]>([]);
  public deleteComment = output<number>();
}
