import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicListCard } from './topic-list-card';

describe('TopicCard', () => {
  let component: TopicListCard;
  let fixture: ComponentFixture<TopicListCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicListCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicListCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
