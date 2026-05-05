import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Passengers } from './passengers';

describe('Passengers', () => {
  let component: Passengers;
  let fixture: ComponentFixture<Passengers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Passengers],
    }).compileComponents();

    fixture = TestBed.createComponent(Passengers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
