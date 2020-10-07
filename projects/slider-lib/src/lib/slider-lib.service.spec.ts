import { TestBed } from '@angular/core/testing';

import { SliderLibService } from './slider-lib.service';

describe('SliderLibService', () => {
  let service: SliderLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SliderLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
