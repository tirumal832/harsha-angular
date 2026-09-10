import { Component, signal, computed, input, InputSignal, Signal, OutputEmitterRef, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-ticket-row',
  styleUrl: './ticket-row.css',
  templateUrl: './ticket-row.html',
})
export class TicketRow
{
  label: InputSignal<string> = input.required<string>();
  count: InputSignal<number> = input.required<number>();
  unitPrice: InputSignal<number> = input<number>(0);

  rowTotal: Signal<number> = computed<number>(() => {
    return this.count() * this.unitPrice()
  });

  increment: OutputEmitterRef<void> = output<void>();
  decrement: OutputEmitterRef<void> = output<void>();

  onIncrement(): void
  {
    this.increment.emit();
  }

  onDecrement(): void
  {
    this.decrement.emit();
  }
}
