import { TestBed } from '@angular/core/testing';

import { RutaProtegidaGuardsService } from './ruta-protegida.guards.service';

describe('RutaProtegidaGuardsService', () => {
  let service: RutaProtegidaGuardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RutaProtegidaGuardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
