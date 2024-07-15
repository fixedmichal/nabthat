import { Injectable } from '@angular/core';
import {
  filter,
  lastValueFrom,
  map,
  mergeMap,
  Observable,
  ReplaySubject,
  Subject,
  tap,
  withLatestFrom,
} from 'rxjs';
import { Option } from '../../models/option.type';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class BlocksService {
  private MINIMAL_INDEX = 2;
  private MAXIMAL_INDEX = 5;
  private stringsFromJson$ = new ReplaySubject<string[]>(1);
  private optionSelected$$ = new ReplaySubject<Option>(1);
  private replaceButtonClicked$$ = new Subject<void>();
  private pasteButtonClicked$$ = new Subject<void>();

  constructor(private http: HttpClient) {
    this.http
      .get<Record<string, string[]>>('./../../../assets/data.json')
      .pipe(
        map((data) => data['data']),
        tap((data) => {
          this.stringsFromJson$.next(data);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  get optionSelected$(): Observable<Option> {
    return this.optionSelected$$
      .asObservable()
      .pipe(filter((optionSelectd) => optionSelectd !== null));
  }

  get replaceButtonClicked$(): Observable<void> {
    return this.replaceButtonClicked$$.asObservable();
  }

  get pasteButtonClicked$(): Observable<void> {
    return this.pasteButtonClicked$$.asObservable();
  }

  emitOptionSelected(option: Option): void {
    this.optionSelected$$.next(option);
  }

  emitReplaceButtonClicked(): void {
    this.replaceButtonClicked$$.next();
  }

  emitPasteButtonClicked(): void {
    this.pasteButtonClicked$$.next();
  }

  stream$() {
    return this.optionSelected$.pipe(
      withLatestFrom(this.stringsFromJson$),
      map(([optionSelected, strings]) => {
        switch (optionSelected) {
          case 'firstOption':
            return strings[0];
          case 'secondOption':
            return strings[1];
          case 'thirdOption':
            const random = Math.floor(
              Math.random() * (this.MAXIMAL_INDEX - this.MINIMAL_INDEX + 1) +
                this.MINIMAL_INDEX
            );
            return strings[random];
          default:
            throw Error('improper option');
        }
      })
    );
  }
}
