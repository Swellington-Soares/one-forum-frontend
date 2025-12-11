import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth.service';
import { CategoryService } from '../../../../core/services/category.service';
import { HomeService } from '../../../../core/services/home.service';
import { TopicService } from '../../../../core/services/topics.service';
import { TopicDialog } from '../../../../shared/components/topic-dialog/topic-dialog';
import { SearchBar } from '../../components/search-bar/search-bar';
import { TopicList } from '../../components/topic-list/topic-list';

@Component({
  selector: 'app-home',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIcon,
    SearchBar,
    TopicList,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly authService = inject(AuthService);
  private readonly homeService = inject(HomeService);
  private readonly dialogService = inject(MatDialog);
  private readonly topicService = inject(TopicService);
  private readonly categoryService = inject(CategoryService);


  openCreateTopicDialog(): void {
    const dialogRef = this.dialogService.open(TopicDialog, {
      width: 'auto',
      maxWidth: 'none',
      data: {
        mode: 'create'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.topicService.createTopic({
        content: result.content,
        categories: result.categories,
        title: result.title
      }).subscribe({
        complete: () => {
          this.homeService.refreshResults();
          this.categoryService.reloadCategories();
        }
      });
    });
  }
}
