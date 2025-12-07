import { Component, computed, inject, signal } from '@angular/core';
import { TopicCard } from '../topic-card/topic-card';
import { MatAnchor, MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { HomeService } from '../../home.service';
import { FiltersCard } from "../filters-card/filters-card";
import { StatusFlag } from '../../model/status-flag.model';
import { Topic } from '../../../../core/models/topics';
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-topic-list',
  imports: [
    TopicCard,
    MatAnchor,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FiltersCard,
    MatPaginatorModule,
    AsyncPipe
],
  templateUrl: './topic-list.html',
  styleUrl: './topic-list.css',
})
export class TopicList {
  StatusFlagEnum = StatusFlag;
  homeService = inject(HomeService);
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  topics: Topic[] = [];
  totalElements = 0;
  pageIndex = 0;
  pageSize = 0;
  
  activeSort = signal("date");
  activeAuthorFilter = signal("all");

  isLogged = toSignal(this.authService.isLogged$);

  statusFlag = signal(StatusFlag.LOADING);

  
  private queryParamsSubscription?: Subscription;
  private initFirstReqSubscription?: Subscription;
  private initUrlCheckSubscription?: Subscription;

  ngOnInit() {

    const currentParams = this.route.snapshot.queryParams;

    let mine = currentParams['mine'];

    if (mine && !this.isLogged()) {
      this.router.navigate([], {
          queryParams: {mine: undefined},
          queryParamsHandling: "merge",
          replaceUrl: true
        },  
      )

      mine = undefined;
    }

    this.homeService.setFilters({
      search: currentParams['search'] || undefined,
      category: +currentParams['category'] || undefined,
      moreLiked: currentParams['moreLiked'] === 'true' ? true : undefined,
      mine: mine === 'true' ? true : undefined,
      page: +currentParams['page'] || 0,
      size: +currentParams['size'] || 10,
      sort: currentParams['sort'] || undefined
    })

    this.initFirstReqSubscription = this.homeService.reqResults$.subscribe({
      next: data => {
        const totalPages = data.totalPages;
        const safePage = Math.max(0, Math.min(data.pageable.pageNumber, totalPages - 1));
        const safeSize = Math.min(data.pageable.pageSize, 50);

        const currentParams = this.route.snapshot.queryParams;

        if (
          +currentParams['page'] !== safePage ||
          +currentParams['size'] !== safeSize
        ) {
          this.router.navigate([], {
              queryParams: {page: safePage, size: safeSize},
              queryParamsHandling: "merge",
              replaceUrl: true
            },  
          )
        }

        this.topics = data.content || [];
        this.totalElements = data.totalElements || 0;
        this.pageIndex = data.pageable.pageNumber;
        this.pageSize = data.pageable.pageSize;
        this.statusFlag.set(StatusFlag.OK);
      },
      error: err => this.statusFlag.set(StatusFlag.ERROR)
    })
    this.initUrlCheckSubscription = this.homeService.filters$.subscribe(filters => {
      this.activeAuthorFilter.set(filters.mine ? 'user' : "all");
      this.activeSort.set(filters.moreLiked ? 'moreLiked' : 'date');
    })
  }

  ngOnDestroy() {
    this.initFirstReqSubscription?.unsubscribe();
    this.initUrlCheckSubscription?.unsubscribe();
    this.queryParamsSubscription?.unsubscribe();
  }
  
  updateSortList(value: "date" | "moreLiked") {
    this.activeSort.set(value);
    if (value === 'date') {
      this.homeService.setFilters({moreLiked: undefined});  
      return;
    }
    this.homeService.setFilters({moreLiked: value === 'moreLiked'});
  }
  
  updatePage(event: PageEvent) {
    this.homeService.setFilters({
      page: event.pageIndex, 
      size: event.pageSize
    });
  }

  updateAuthorFilter(value: "all" | "user") {
    this.activeAuthorFilter.set(value);
    if (value === 'all') {
      this.homeService.setFilters({mine: undefined});  
      return;
    }
    this.homeService.setFilters({mine: value === "user"});
  }
}