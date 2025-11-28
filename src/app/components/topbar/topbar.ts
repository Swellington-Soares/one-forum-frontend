import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { userService } from '../../core/services/user';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-topbar',
  imports: [MatToolbarModule, RouterLink],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  private readonly route = inject(ActivatedRoute)
  private readonly userId = Number(this.route.snapshot.paramMap.get("id"))
  private readonly userService = inject(userService)
  protected user: WritableSignal<User> = signal({} as User)
  
  ngOnInit(): void{
    this.userService.getUser(this.userId!).subscribe((user)=>{
      this.user.set({
        id: user.id,
        createdAt: user.createdAt,
        profileName: user.profileName,
        profilePhoto: user.profilePhoto
      })
    })
  }

  loggedUser = 1
}
