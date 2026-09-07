import { Component, signal, computed, Signal, WritableSignal, effect, linkedSignal, resource } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface User
{
  name: string;
  role: string;
}

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
      const show: string = this.selectedShowTime();
      const base: string = `You are booking ${this.totalTickets()} tickets, for $${this.totalCost()}`;
      return show ? `${base}, for the ${show} show.` : `${base}.`;
    }
  );

  readonly showTimes: string[] = [ '10 AM', '2 PM', '7 PM'];
  selectedShowTime: WritableSignal<string> = signal<string>('');

  currentUser: WritableSignal<User> = signal<User>({name: 'Guest', role: 'visitor'}, {
    equal: (a: User, b: User): boolean => {
      return a.name === b.name && a.role === b.role;
    }
  });

  recommendedPackage: WritableSignal<string> = linkedSignal<string>(() => {
    const count: number = this.totalTickets();
    if (count == 0) return 'None';
    if (count <= 2) return 'Basic Package';
    if (count <= 5) return 'Family Package';
    return 'Group Package';
  });

  seatAvailability = resource({
    params: () => {
      const show: string = this.selectedShowTime();
      return show ? show : undefined;
    },
    loader: async ({params}) => {
      return this.fetchSeatAvailability(params);
    }
  });
  
  constructor()
  {
    effect((onCleanUp) => {
      const count: number = this.adultTickets();
      const timerId = setTimeout(() => {
        console.log(`Booking confirmed for ${count} adult tickets`);
      }, 3000);
      
      onCleanUp(() => {
        clearTimeout(timerId);
      });
    });

    effect(() => {
      console.log('Current user changed: ', this.currentUser());
    });
  }

  private async fetchSeatAvailability(showTime: string): Promise<number>
  {
    await new Promise<void>(
      (resolve) => {
        return setTimeout(resolve, 1000);
      }
    );

    const seatMap: Record<string, number> = {
      '10 AM': 120,
      '2 PM': 45,
      '7 PM': 8
    };

    return seatMap[showTime] ?? 0;
  }

  upgradeToPremium(): void
  {
    this.recommendedPackage.set('Premium Package');
  }

  refreshUser(): void
  {
    this.currentUser.set({ name: 'Guest', role: 'visitor'});
  }

  selectShowTime(time: string): void
  {
    this.selectedShowTime.set(time);
  }

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
