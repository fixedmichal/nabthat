import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  first,
  forkJoin,
  map,
  mergeMap,
  Observable,
  ReplaySubject,
  Subject,
  tap,
} from 'rxjs';
import { Option } from '../../models/option.type';
import { HttpClient } from '@angular/common/http';
import { loremIpsumText } from '../constants/lorem-ipsum-text.constants';
import { TextRecord } from '../../models/text-record.type';

@Injectable({ providedIn: 'root' })
export class BlocksService {
  private readonly MINIMAL_INDEX = 2;
  private readonly MAXIMAL_INDEX = 5;

  private textRecordsFromJson$ = new ReplaySubject<TextRecord[]>(1);

  private optionSelected$$ = new ReplaySubject<Option>(1);
  private replaceButtonClicked$$ = new Subject<void>();
  private pasteButtonClicked$$ = new Subject<void>();

  private isAuthorNameDisplayed$$ = new BehaviorSubject<boolean>(false);
  private outputText$$ = new BehaviorSubject<string[]>([loremIpsumText]);

  constructor(private http: HttpClient) {
    this.getStringsFromJsonFile().subscribe();

    this.setupAppendTextStream$()
      .pipe(tap((text) => console.log('appendedTEXT:', text)))
      .subscribe();

    this.setupReplaceTextStream$()
      .pipe(tap((text) => console.log('replacemenetTEXT:', text)))
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

  get appendButtonClicked$(): Observable<void> {
    return this.pasteButtonClicked$$.asObservable();
  }

  get isAuthorNameDisplayed$() {
    return this.isAuthorNameDisplayed$$.asObservable();
  }

  get outputText$() {
    return this.outputText$$.asObservable();
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

  setOutputTextDefaultValue(): void {
    this.outputText$$.next([loremIpsumText]);
  }

  private setupAppendTextStream$() {
    return this.appendButtonClicked$.pipe(
      mergeMap(() =>
        forkJoin([
          this.optionSelected$.pipe(first()),
          this.textRecordsFromJson$.pipe(first()),
        ])
      ),
      tap(([optionSelected, stringsFromJson]) =>
        this.generateAppendedOutputText(optionSelected, stringsFromJson)
      )
    );
  }

  private setupReplaceTextStream$() {
    return this.replaceButtonClicked$.pipe(
      mergeMap(() =>
        forkJoin([
          this.optionSelected$.pipe(first()),
          this.textRecordsFromJson$.pipe(first()),
        ])
      ),
      tap(([optionSelected, stringsFromJson]) =>
        this.generateReplacementText(optionSelected, stringsFromJson)
      )
    );
  }

  private generateAppendedOutputText(
    optionSelected: Option,
    textRecordsFromJson: TextRecord[]
  ) {
    let textToAppend: string | null = null;
    let index: number;

    switch (optionSelected) {
      case 'firstOption':
        index = 0;
        textToAppend = this.getTextFromJsonToAppendAndSetItsFlag(
          textRecordsFromJson,
          index
        );

        break;
      case 'secondOption':
        index = 1;
        textToAppend = this.getTextFromJsonToAppendAndSetItsFlag(
          textRecordsFromJson,
          index
        );

        break;
      case 'thirdOption':
        let isThereNoMoreNotDisplayedValues: boolean;

        isThereNoMoreNotDisplayedValues = !textRecordsFromJson
          .slice(2, 6)
          .find((textRecord) => textRecord.isDisplayed === false);

        console.log('sliced Array:', textRecordsFromJson.slice(2, 6));
        console.log(
          'isThereNoMoreNotDisplayedValues: ',
          isThereNoMoreNotDisplayedValues
        );

        if (isThereNoMoreNotDisplayedValues) {
          break;
        }

        while (!textToAppend) {
          const randomIndex = this.generateRandomIndexFromRange();
          console.log(randomIndex);

          textToAppend = this.getTextFromJsonToAppendAndSetItsFlag(
            textRecordsFromJson,
            randomIndex
          );
          console.log('"textToAppend" in WHILE LOOP', textToAppend);
        }
        break;

      default:
        throw Error('invalid option');
    }

    if (textToAppend === null) {
      // TODO: DIALOG HERE!
    }

    textToAppend
      ? this.outputText$$.next(
          this.outputText$$.value.concat(textToAppend).sort()
        )
      : this.outputText$$.next(this.outputText$$.value.sort());
  }

  private generateReplacementText(
    optionSelected: Option,
    textRecordsFromJson: TextRecord[]
  ): void {
    let replacementText: string | null = null;
    let index: number;

    switch (optionSelected) {
      case 'firstOption':
        index = 0;
        replacementText = this.getTextForReplacementFromJsonAndSetFlags(
          textRecordsFromJson,
          index
        );

        break;
      case 'secondOption':
        index = 1;
        replacementText = this.getTextForReplacementFromJsonAndSetFlags(
          textRecordsFromJson,
          index
        );

        break;
      case 'thirdOption':
        textRecordsFromJson = textRecordsFromJson.map((textRecord) => ({
          ...textRecord,
          isDisplayed: false,
        }));

        do {
          const randomIndex = this.generateRandomIndexFromRange();
          replacementText = this.getTextForReplacementFromJsonAndSetFlags(
            textRecordsFromJson,
            randomIndex
          );
          console.log('replacementText', replacementText);
        } while (!replacementText);
        break;

      default:
        throw Error('invalid option');
    }

    replacementText
      ? this.outputText$$.next([replacementText])
      : this.outputText$$.next(this.outputText$$.value);
  }

  private getTextFromJsonToAppendAndSetItsFlag(
    textRecordsFromJson: TextRecord[],
    index: number
  ): string | null {
    let text: string | null = null;

    if (!textRecordsFromJson[index].isDisplayed) {
      text = textRecordsFromJson[index].value;

      textRecordsFromJson[index].isDisplayed = true;
      this.textRecordsFromJson$.next(textRecordsFromJson);
    }

    return text;
  }

  private getTextForReplacementFromJsonAndSetFlags(
    textRecordsFromJson: TextRecord[],
    index: number
  ): string | null {
    let text: string | null = null;

    text = textRecordsFromJson[index].value;

    textRecordsFromJson = textRecordsFromJson.map((textRecord) => ({
      ...textRecord,
      isDisplayed: false,
    }));
    textRecordsFromJson[index].isDisplayed = true;

    this.textRecordsFromJson$.next(textRecordsFromJson);

    return text;
  }

  private getStringsFromJsonFile() {
    return this.http
      .get<Record<string, TextRecord[]>>('./../../../assets/data.json')
      .pipe(
        map((data) => data['data']),
        tap((stringsFromJson) => {
          this.textRecordsFromJson$.next(stringsFromJson);
        })
        // takeUntilDestroyed()
      );
  }

  private generateRandomIndexFromRange(): number {
    return Math.floor(
      Math.random() * (this.MAXIMAL_INDEX - this.MINIMAL_INDEX + 1) +
        this.MINIMAL_INDEX
    );
  }
}
