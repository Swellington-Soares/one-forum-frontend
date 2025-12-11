import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm-account-alert',
  imports: [],
  templateUrl: './confirm-account-alert.html',
  styleUrl: './confirm-account-alert.css',
})
export class ConfirmAccountAlert implements OnInit {

   constructor(private route: ActivatedRoute) {}

  notIsConfirmed = signal<boolean>(true);
  email = signal<string>("");

  ngOnInit(): void {
    const data = history.state;
    this.email.set(data?.email || "");
    this.notIsConfirmed.set(data?.isLocked);
    if (!data?.isLocked) {
      if ((this.route.snapshot.queryParams['status'] as string | undefined) === 'success') {
        this.notIsConfirmed.set(false);
      }
    }
  }


  resendConfirmationEmail(): void {

  }

}
