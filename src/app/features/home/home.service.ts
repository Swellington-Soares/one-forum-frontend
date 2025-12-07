import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { Topic } from '../../core/models/topics';
import { environment } from '../../../environments/environment';
import { TopicQueryEntity } from './model/topic-query-entity.model';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, debounceTime, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  getCurrentFilterCategoryId() {
    return this.filters$.subscribe(data => data.category)
  }
  
  private authService = inject(AuthService);
  private router = inject(Router);

  private httpClient: HttpClient;
  private apiUrl = environment.apiBaseUrl + "/topics";
  private loggedUserId = computed(() => this.authService.currentUser()?.id);

  private filtersSubject = new BehaviorSubject<TopicQueryEntity>({});
  filters$ = this.filtersSubject.asObservable();

  reqResults$ = this.filters$.pipe(
    debounceTime(300),
    switchMap(filters => {
      let queryParams = new URLSearchParams();

      queryParams.append("authorId", filters.mine ? this.loggedUserId()?.toString() || '' : '');
      queryParams.append("categoryId", filters.category?.toString() || "");
      queryParams.append("title", filters.search || "");
      queryParams.append("moreLiked", filters.moreLiked?.toString() || "");
      queryParams.append("page", filters.page?.toString() || "0");
      queryParams.append("size", filters.size?.toString() || "10");
      queryParams.append("sort", filters.moreLiked ? "" : filters.sort?.toString() || "createdAt,desc");

      return this.httpClient
        .get<{
          content: Topic[],
          totalElements: number,
          totalPages: number,
          pageable: {
            pageNumber: number,
            pageSize: number
          }
        }>(`${this.apiUrl}?${queryParams.toString()}`)
    }),
  )

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  setFilters(filters: TopicQueryEntity) {
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
    })
  }

  refreshResults() {
    this.filtersSubject.next(this.filtersSubject.getValue());
  }

}