import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { learnComponent } from './learn.component';

describe('learnComponent', () => {
  let component: learnComponent;
  let fixture: ComponentFixture<learnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ learnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(learnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
