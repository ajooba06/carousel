import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderLibComponent } from './slider-lib.component';

describe('SliderLibComponent', () => {
  let component: SliderLibComponent;
  let fixture: ComponentFixture<SliderLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderLibComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
