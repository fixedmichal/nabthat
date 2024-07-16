import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { tap } from 'rxjs';
import { Option } from '../../../models/option.type';
import { BlocksService } from '../../../core/services/blocks.service';
@Component({
  selector: 'app-first-block',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './first-block.component.html',
  styleUrl: './first-block.component.scss',
})
export class FirstBlockComponent implements OnInit {
  private readonly someService = inject(BlocksService);

  protected options = new FormControl<Option>({
    value: null,
    disabled: false,
  });

  protected radioButtons = [
    {
      id: 'firstOptionRadioButton',
      value: 'firstOption',
      text: 'Opcja pierwsza',
    },
    {
      id: 'secondOptionRadioButton',
      value: 'secondOption',
      text: 'Opcja druga',
    },
    {
      id: 'thirdOptionRadioButton',
      value: 'thirdOption',
      text: 'Opcja losowa',
    },
  ];

  constructor() {
    // this.someService
    //   .stream$()
    //   .pipe(
    //     tap((data) => console.log('stream: ', data)),
    //     takeUntilDestroyed()
    //   )
    //   .subscribe();
  }

  ngOnInit(): void {
    this.options.valueChanges
      .pipe(
        tap((option) => {
          this.someService.emitOptionSelected(option);
        })
      )
      .subscribe();
  }
}
