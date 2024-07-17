import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BlocksService } from '../../services/blocks.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  private readonly blocksService = inject(BlocksService);

  onShowPersonalDataClick(): void {
    this.blocksService.setIsAuthorNameDisplayedTrue();
  }

  onResetSettingsClick(): void {
    this.blocksService.resetSettingsToDefault();
  }
}
