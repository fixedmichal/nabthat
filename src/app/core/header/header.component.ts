import { Component, inject } from '@angular/core';
import { BlocksService } from '../services/blocks.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly blocksService = inject(BlocksService);
  protected isAuthorNameDisplayed$ = this.blocksService.isAuthorNameDisplayed$;
}
