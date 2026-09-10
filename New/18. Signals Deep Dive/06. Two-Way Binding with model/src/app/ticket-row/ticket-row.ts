import { Component, computed, input, InputSignal, Signal, model, ModelSignal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-ticket-row',
  styleUrl: './ticket-row.css',
  templateUrl: './ticket-row.html',
})
export class TicketRow
{
  label: InputSignal<string> = input.required<string>();
  count: ModelSignal<number> = model.required<number>();
  unitPrice: InputSignal<number> = input<number>(0);

  rowTotal: Signal<number> = computed<number>(() => {
    return this.count() * this.unitPrice()
  });

  onIncrement(): void
  {
    this.count.update((current: number) => current + 1);
  }

  onDecrement(): void
  {
    this.count.update((current: number) => 
      current > 0 ? current - 1 : 0
    );
  }
}
