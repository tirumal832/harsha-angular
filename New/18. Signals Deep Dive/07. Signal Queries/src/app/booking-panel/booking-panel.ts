import { Component, computed, contentChild, ElementRef, Signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-booking-panel',
  styleUrl: './booking-panel.css',
  templateUrl: './booking-panel.html',
})
export class BookingPanel
{
  bookingNote: Signal<ElementRef<HTMLParagraphElement> | undefined> = contentChild<ElementRef<HTMLParagraphElement>>('bookingNote');

  hasArrivalGuidance: Signal<boolean> = computed<boolean>(
    () => {
      return this.bookingNote() != undefined
    }
  );
}
