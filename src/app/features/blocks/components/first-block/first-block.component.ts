import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { tap } from 'rxjs';
import { Option } from '../../../../models/option.type';
import { BlocksService } from '../../../../core/services/blocks.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-first-block',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './first-block.component.html',
  styleUrl: './first-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirstBlockComponent implements OnInit {
  private readonly blocksService = inject(BlocksService);
  private readonly destroyRef = inject(DestroyRef);

  protected options = new FormControl<Option>({
    value: null,
    disabled: false,
  });

  protected radioButtonsConfig = [
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

  ngOnInit(): void {
    this.options.valueChanges
      .pipe(
        tap((option) => this.blocksService.emitOptionSelected(option)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.blocksService.resetRadioButtons$
      .pipe(
        tap(() => this.options.reset()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
