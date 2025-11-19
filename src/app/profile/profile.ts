import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-profile',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatInputModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

}
