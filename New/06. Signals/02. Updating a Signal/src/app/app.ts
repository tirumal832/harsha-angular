import { Component, signal, Signal, WritableSignal } from '@angular/core';
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
