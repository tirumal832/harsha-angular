import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketRow } from './ticket-row';

describe('TicketRow', () => {
  let component: TicketRow;
  let fixture: ComponentFixture<TicketRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketRow],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
