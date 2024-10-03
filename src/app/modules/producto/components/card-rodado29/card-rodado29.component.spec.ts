import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRodado29Component } from './card-rodado29.component';

describe('CardRodado29Component', () => {
  let component: CardRodado29Component;
  let fixture: ComponentFixture<CardRodado29Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardRodado29Component]
    });
    fixture = TestBed.createComponent(CardRodado29Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
