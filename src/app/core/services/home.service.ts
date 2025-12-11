import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, debounceTime, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Topic } from '../models/topics';
import { TopicListQueryEntity } from '../models/topic-query-entity.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly apiUrl = `${environment.apiBaseUrl}/topics`;
  private readonly loggedUserId = computed(() => this.authService.currentUser()?.id);

  private readonly filtersSubject = new BehaviorSubject<TopicListQueryEntity>({});
  readonly filters$ = this.filtersSubject.asObservable();

  readonly reqResults$ = this.filters$.pipe(
    debounceTime(300),
    switchMap(filters => {
      const queryParams = new URLSearchParams();

      queryParams.append("authorId", filters.mine ? this.loggedUserId()?.toString() || '' : '');
      queryParams.append("categoryId", filters.category?.toString() || "");
      queryParams.append("title", filters.search || "");
      queryParams.append("moreLiked", filters.moreLiked?.toString() || "");
      queryParams.append("page", filters.page?.toString() || "0");
      queryParams.append("size", filters.size?.toString() || "10");
      queryParams.append("sort", filters.moreLiked ? "" : filters.sort?.toString() || "createdAt,desc");

      return this.http.get<{
        content: Topic[];
        totalElements: number;
        totalPages: number;
        pageable: {
          pageNumber: number;
          pageSize: number;
        };
      }>(`${this.apiUrl}?${queryParams.toString()}`);
    }),
  );

  getCurrentFilterCategoryId() {
    return this.filters$.subscribe(data => data.category);
  }

  setFilters(filters: TopicListQueryEntity): void {
    if (filters.page == null) {
      filters.page = 0;
    }

    this.filtersSubject.next({
      ...this.filtersSubject.getValue(),
      ...filters
    });

    this.router.navigate([], {
      queryParams: filters,
      queryParamsHandling: "merge",
      replaceUrl: true,
    });
  }

  refreshResults(): void {
    this.filtersSubject.next(this.filtersSubject.getValue());
  }
}