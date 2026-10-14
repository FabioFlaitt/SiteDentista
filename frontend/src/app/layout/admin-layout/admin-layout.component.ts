import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';

interface AdminLink {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-surface-muted flex">
      <aside
        class="hidden md:flex flex-col w-60 border-r border-brand-100 bg-white py-6"
        aria-label="Navegação do painel"
      >
        <div class="px-6">
          <p class="font-display text-lg text-brand-900">Painel</p>
          <p class="text-xs text-brand-500">Área administrativa</p>
        </div>
        <nav class="mt-6 flex-1 flex flex-col gap-1 px-3">
          @for (link of links; track link.path) {
            <a
              [routerLink]="link.path"
              routerLinkActive="bg-brand-50 text-brand-900"
              class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-brand-700 no-underline
                     hover:bg-brand-50"
            >
              <lucide-angular [name]="link.icon" [size]="18" aria-hidden="true"></lucide-angular>
              {{ link.label }}
            </a>
          }
        </nav>
        <div class="px-6 mt-4 text-xs text-brand-500">
          <p>{{ auth.currentUser()?.displayName ?? 'Administrador' }}</p>
          <p class="truncate">{{ auth.currentUser()?.email }}</p>
          <button type="button" class="btn-ghost mt-3 px-0" (click)="logout()">Sair</button>
        </div>
      </aside>

      <div class="flex-1 flex flex-col">
        <header
          class="bg-white border-b border-brand-100 px-6 py-4 flex items-center justify-between"
        >
          <div class="md:hidden font-display text-brand-900">Painel</div>
          <div class="flex items-center gap-3 ml-auto text-sm text-brand-700">
            <lucide-angular name="user-round" [size]="18" aria-hidden="true"></lucide-angular>
            <span>{{ auth.currentUser()?.email ?? 'Admin' }}</span>
          </div>
        </header>
        <main class="flex-1 p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AdminLayoutComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly links: AdminLink[] = [
    { label: 'Resumo', path: '/admin/dashboard', icon: 'layout-dashboard' },
    { label: 'Tráfego', path: '/admin/traffic', icon: 'activity' },
    { label: 'Localizações', path: '/admin/locations', icon: 'map-pin' },
    { label: 'Cliques WhatsApp', path: '/admin/whatsapp-clicks', icon: 'message-circle' },
  ];

  logout(): void {
    this.auth.logout().subscribe({
      next: () => void this.router.navigate(['/admin/login']),
      error: () => void this.router.navigate(['/admin/login']),
    });
  }
}
