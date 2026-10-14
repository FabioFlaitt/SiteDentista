import { Routes } from '@angular/router';
import { adminAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/public-layout/public-layout.component').then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
        data: {
          title: 'Dra. Bruna Molina — Cirurgiã-Dentista em Araraquara/SP',
          description:
            'Atendimento odontológico com atenção à estética, saúde e funcionalidade do sorriso. CRO-SP 145594.',
        },
      },
      {
        path: 'sobre',
        loadComponent: () =>
          import('./features/about/about.component').then((m) => m.AboutComponent),
        data: {
          title: 'Sobre a Dra. Bruna Molina — CRO-SP 145594',
          description:
            'Conheça a Dra. Bruna Naiara Molina, cirurgiã-dentista em Araraquara/SP.',
        },
      },
      {
        path: 'servicos',
        loadComponent: () =>
          import('./features/services/services.component').then((m) => m.ServicesPageComponent),
        data: {
          title: 'Serviços Odontológicos — Dra. Bruna Molina',
          description:
            'Lista de serviços odontológicos oferecidos. Entre em contato para informações.',
        },
      },
      {
        path: 'localizacao',
        loadComponent: () =>
          import('./features/location/location.component').then((m) => m.LocationPageComponent),
        data: {
          title: 'Localização — Dra. Bruna Molina em Araraquara/SP',
          description: 'Endereço, horários e rota até o consultório.',
        },
      },
      {
        path: 'contato',
        loadComponent: () =>
          import('./features/contact/contact.component').then((m) => m.ContactPageComponent),
        data: {
          title: 'Contato — Dra. Bruna Molina',
          description: 'Fale pelo WhatsApp, Instagram ou formulário.',
        },
      },
    ],
  },
  {
    path: 'admin',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/admin/login/admin-login.component').then(
            (m) => m.AdminLoginComponent,
          ),
        data: { title: 'Login administrativo' },
      },
      {
        path: '',
        canActivate: [adminAuthGuard],
        loadComponent: () =>
          import('./layout/admin-layout/admin-layout.component').then(
            (m) => m.AdminLayoutComponent,
          ),
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./features/admin/dashboard/admin-dashboard.component').then(
                (m) => m.AdminDashboardComponent,
              ),
            data: { title: 'Painel administrativo' },
          },
          {
            path: 'traffic',
            loadComponent: () =>
              import('./features/admin/traffic/admin-traffic.component').then(
                (m) => m.AdminTrafficComponent,
              ),
            data: { title: 'Tráfego — Painel administrativo' },
          },
          {
            path: 'locations',
            loadComponent: () =>
              import('./features/admin/locations/admin-locations.component').then(
                (m) => m.AdminLocationsComponent,
              ),
            data: { title: 'Localizações — Painel administrativo' },
          },
          {
            path: 'whatsapp-clicks',
            loadComponent: () =>
              import('./features/admin/whatsapp-clicks/admin-whatsapp.component').then(
                (m) => m.AdminWhatsAppComponent,
              ),
            data: { title: 'Cliques no WhatsApp — Painel administrativo' },
          },
        ],
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    data: { title: 'Página não encontrada' },
  },
];
