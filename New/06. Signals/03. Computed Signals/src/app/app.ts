import { Component, signal, computed, Signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App
{
  adultTickets: WritableSignal<number> = signal<number>(0);
  childTickets: WritableSignal<number> = signal<number>(0);
  totalTickets: Signal<number> = computed<number>(
    () => {
      return this.adultTickets() + this.childTickets()
    }
  );

  readonly adultTicketPrice: number = 12;
  readonly childTicketPrice: number = 8;

  totalCost: Signal<number> = computed(
    () => {
      return (this.adultTickets() * this.adultTicketPrice) + (this.childTickets() * this.childTicketPrice);
    }
  );

  summaryText : Signal<string> = computed<string>(
    () => {
      return `You are booking ${this.totalTickets()} tickets, for $${this.totalCost()}`;
    }
  );

  incrementAdultTickets(): void
  {
    this.adultTickets.update(
      (count: number) => count + 1
    );
  }

  decrementAdultTickets(): void
  {
    this.adultTickets.update(
      (count: number) => count > 0 ? count - 1 : 0
    );
  }

  incrementChildTickets(): void
  {
    this.childTickets.update(
      (count: number) => count + 1
    );
  }

  decrementChildTickets(): void
  {
    this.childTickets.update(
      (count: number) => count > 0 ? count - 1 : 0
    );
  }

  reset(): void
  {
    this.adultTickets.set(0);
    this.childTickets.set(0);
  }
}
