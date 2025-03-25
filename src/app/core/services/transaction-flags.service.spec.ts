import { TestBed } from '@angular/core/testing';

import { TransactionFlagsService } from './transaction-flags.service';

describe('TransactionFlagsService', () => {
  let service: TransactionFlagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionFlagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
