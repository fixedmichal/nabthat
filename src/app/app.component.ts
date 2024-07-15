import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { FirstBlockComponent } from './features/blocks/first-block/first-block.component';
import { SecondBlockComponent } from './features/blocks/second-block/second-block.component';
import { ThirdBlockComponent } from './features/blocks/third-block/third-block.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    FirstBlockComponent,
    SecondBlockComponent,
    ThirdBlockComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'nabthat';
}
