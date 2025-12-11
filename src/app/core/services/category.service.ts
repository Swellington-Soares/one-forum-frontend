import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Category } from '../models/category.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly endpoint = environment.apiBaseUrl + "/categories";

  private readonly httpClient: HttpClient;
  private reloadTrigger = new BehaviorSubject<void>(undefined);
  private readonly destroyRef = inject(DestroyRef);

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  allCategories$ = this.reloadTrigger.pipe(
    switchMap(() => this.httpClient.get<Category[]>(`${this.endpoint}`)),
    takeUntilDestroyed(this.destroyRef)
  );

  reloadCategories() {
    this.reloadTrigger.next(undefined);
  }
}
