import { TestBed } from '@angular/core/testing';

import { CardRenderService } from './card-render.service';

describe('CardRenderService', () => {
  let service: CardRenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardRenderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
