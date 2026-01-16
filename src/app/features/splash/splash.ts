import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'splash',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './splash.html',
  styleUrl: './splash.css',
})
export class Splash {
  private router = inject(Router);

  protected goLogin(): void {
    this.router.navigate(['/login']);
  }

  protected goSignUp(): void {
    this.router.navigate(['/register']);
  }
}
