import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../core/models/user';
import { Topic } from '../../core/models/topics';
// CORREÇÃO: Importar a classe UserService (com 'U' maiúsculo)
import { UserService } from '../../core/services/user'; 
import { TopicService } from '../../core/services/topics.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-profile',
  imports: [
    CommonModule,
    MatCardModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTabsModule
  ],
  templateUrl: './public-profile.html',
  styleUrl: './public-profile.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PublicProfile implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userId = Number(this.route.snapshot.paramMap.get("id"));
  // CORREÇÃO: Injetar a classe UserService e atribuir a uma variável (ex: _userService)
  private readonly _userService = inject(UserService); 
  private readonly topicService = inject(TopicService);
    
  protected user: WritableSignal<User> = signal({
    id: 0,
    email: '',
    password: '',
    createdAt: '',
    updateAt: '',
    profile: { // 'profile' é inicializado, por isso o '?. ' não é necessário no template.
      name: '',
      photo: ''
    },
    emailVerified: false,
    locked: false,
    deleted: false
  } as User);
  protected userTopics: WritableSignal<Topic[]> = signal([]);
  protected reputation = signal(560);
  protected questionsCount = signal(0);
  protected memberSince = signal('December 2025');
  protected daysOnPlatform = signal(0);
  protected aboutText = signal('Student at Oracle Next Education program, passionate about learning web development.');
    
  ngOnInit(): void {
    // CORREÇÃO: Usar a nova variável injetada '_userService'
    this._userService.getUser(this.userId!).subscribe({
      next: (user) => {
        this.user.set({
          id: user.id,
          createdAt: user.createdAt,
          updateAt: user.updateAt,
          email: user.email,
          password: user.password,
          profile: user.profile,
          emailVerified: user.emailVerified,
          locked: user.locked,
          deleted: user.deleted
        });
                
        const createdDate = new Date(user.createdAt);
        this.memberSince.set(createdDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
                
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - createdDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        this.daysOnPlatform.set(diffDays);
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });
        
    this.topicService.getTopicsByUser(this.userId!, 0, 10).subscribe({
      next: (response) => {
        this.userTopics.set(response.content);
        this.questionsCount.set(response.content.length);
      },
      error: (error) => {
        console.error('Error loading topics:', error);
        this.userTopics.set([]);
        this.questionsCount.set(0);
      }
    });
  }
    
  getInitials(name: string): string {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
    
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }
}