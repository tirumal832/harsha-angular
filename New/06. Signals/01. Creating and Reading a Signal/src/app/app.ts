import { Component, signal, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  adultTickets: Signal<number> = signal<number>(0);
  childTickets: Signal<number> = signal<number>(0);
}
