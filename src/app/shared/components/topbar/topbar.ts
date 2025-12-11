import { Component, computed, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { toSignal } from '@angular/core/rxjs-interop';
import * as StringUtils from '../../utils/string.utils';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-topbar',
  imports: [MatToolbarModule, RouterLink, MatIcon, MatButtonModule, MatTooltipModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  private authService = inject(AuthService);
  protected themeService = inject(ThemeService);

  protected isLogged = toSignal(this.authService.isLogged$);
  protected currentUser = computed(() => this.authService.currentUser());

  protected getUserInitials(): String {
    return StringUtils.getInitials(this.currentUser()?.profileName) || '';
  }

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
