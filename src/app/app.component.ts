import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { FirstBlockComponent } from './features/blocks/components/first-block/first-block.component';
import { SecondBlockComponent } from './features/blocks/components/second-block/second-block.component';
import { ThirdBlockComponent } from './features/blocks/components/third-block/third-block.component';
import { BlocksService } from './core/services/blocks.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AsyncPipe,
    HeaderComponent,
    FooterComponent,
    FirstBlockComponent,
    SecondBlockComponent,
    ThirdBlockComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private service: BlocksService) {}

  projectedContentTexts$ = this.service.outputTexts$;
}
