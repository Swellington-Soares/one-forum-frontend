import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { HomeService } from '../../../../core/services/home.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  imports: [
    MatFormFieldModule, 
    FormsModule,
    MatInputModule
  ],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  homeService = inject(HomeService);
  
  searchFieldValue = "";
  placeholder = input("");

  initUrlCheckSubscription?: Subscription;

  ngOnInit() {
    this.initUrlCheckSubscription = this.homeService.filters$.subscribe(filters => {
      this.searchFieldValue = filters.search ?? "";
    })
  }

  ngOnDestroy() {
    this.initUrlCheckSubscription?.unsubscribe();
  }

  enterPressed() {
    if (this.searchFieldValue === '') {
      this.homeService.setFilters({search: undefined});
      return
    }
    this.homeService.setFilters({search: this.searchFieldValue})
  }
}
