import { TestBed } from '@angular/core/testing';

import { ChunkytextService } from './chunkytext.service';

describe('ChunkytextService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChunkytextService = TestBed.get(ChunkytextService);
    expect(service).toBeTruthy();
  });
});
