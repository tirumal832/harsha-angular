import { Component, signal, computed, Signal, WritableSignal, effect, linkedSignal, resource, inject, viewChild, ElementRef } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { debounceTime, distinctUntilChanged, interval, Observable, of, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TicketRow } from './ticket-row/ticket-row';
import { BookingPanel } from './booking-panel/booking-panel';

interface User
{
  name: string;
  role: string;
}

interface Movie
{
  id: number;
  title: string;
  body: string;
}

@Component({
  imports: [FormsModule, TicketRow, BookingPanel],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App
{
  private http: HttpClient = inject(HttpClient);

  movieSearchInput: Signal<ElementRef<HTMLInputElement>> = viewChild.required<ElementRef<HTMLInputElement>>('movieSearch');

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

  moviesResource = httpResource<Movie[]>(
    () => 'https://jsonplaceholder.typicode.com/posts?_limit=5'
  );

  selectedMovieId: WritableSignal<number | undefined> = signal<number | undefined>(undefined);

  movieDetailsResource = httpResource<Movie>(() => {
    const id: number | undefined = this.selectedMovieId();
    return id ? `https://jsonplaceholder.typicode.com/posts/${id}` : undefined;
  });

  tickerObservable: Observable<number> = interval(1000);
  
  ticker: Signal<number> = toSignal(this.tickerObservable, { initialValue: 0});

  searchQuery: WritableSignal<string> = signal<string>('');

  searchResults: Signal<Movie[]> = toSignal(toObservable(this.searchQuery).pipe(
    debounceTime(400),
    distinctUntilChanged(),
    switchMap((query: string) => {
      if (!query.trim())
      {
        return of<Movie[]>( [] );
      }

      return this.http.get<Movie[]>(`https://jsonplaceholder.typicode.com/posts?q=${query}&_limit=5`);
    })
  ),
  { initialValue: [] }
  );


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

  focusMovieSearch(): void
  {
    this.movieSearchInput().nativeElement.focus();
  }

  clearShowTime(): void
  {
    this.selectedShowTime.set('');
  }

  selectMovie(id: number): void
  {
    this.selectedMovieId.set(id);
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


  onCountChanged(newCount: number): void
  {
    console.log('Adult ticket count changed to: ', newCount);
  }
}
