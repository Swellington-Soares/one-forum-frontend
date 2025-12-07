import { Component, DestroyRef, ElementRef, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { CategoryService } from '../../../../core/services/category.service';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatChipOption, MatChipSelectionChange, MatChipsModule } from "@angular/material/chips";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from "@angular/material/form-field";
import { Category } from '../../model/category.model';
import { HomeService } from '../../home.service';
import { StatusFlag } from '../../model/status-flag.model';
import { Subscription, tap } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-filters-card',
  imports: [
    MatCardModule, 
    MatIconModule, 
    MatProgressSpinnerModule,
    MatChipsModule, 
    MatButtonModule, 
    MatFormFieldModule
  ],
  templateUrl: './filters-card.html',
  styleUrl: './filters-card.css',
})
export class FiltersCard {
  private readonly categoryService = inject(CategoryService);
  private readonly homeService = inject(HomeService);
  private readonly destroyRef = inject(DestroyRef);
  readonly statusFlagEnumm = StatusFlag;

  statusFlag = signal(StatusFlag.LOADING);
  
  allCategories = toSignal(
    this.categoryService.allCategories$.pipe(
      tap({
        next: categoryList => {
          this.statusFlag.set(StatusFlag.OK);
          return categoryList.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0);
        },
        error: () => this.statusFlag.set(StatusFlag.ERROR)
      }),
      takeUntilDestroyed(this.destroyRef)
    ),
    { initialValue: [] as Category[] }
  );

  private filtersSignal = toSignal(this.homeService.filters$);

  @ViewChildren('categoryOpt') categoryRefList!: QueryList<MatChipOption>;

  ngAfterViewInit() {
    this.categoryRefList.changes.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      (newList: QueryList<MatChipOption>) => {        
        this.selectChipFromUrlFilter();
      }
    );
    
    if (this.categoryRefList.length > 0) {
      this.selectChipFromUrlFilter();
    }
  }

  selectChipById(categoryId: number) {
    const chipToSelect = this.categoryRefList.find(
      (chipInstance: MatChipOption) => {
        const idAsString = chipInstance._elementRef.nativeElement.getAttribute('data-category-id');
        return idAsString === categoryId.toString();
      }
    );

    if (chipToSelect && !chipToSelect.selected) {
      chipToSelect.select()
    }
  }

  selectChipFromUrlFilter() {
    const filters = this.filtersSignal();
    
    if (filters?.category !== null && filters?.category !== undefined) {
      this.selectChipById(filters.category);
    }
  }

  selectFilter(event: MatChipSelectionChange, categoryId: number) {
    if (event.selected) {
      this.homeService.setFilters({category: categoryId});
      return;
    }
    this.homeService.setFilters({category: undefined});
  }
}
