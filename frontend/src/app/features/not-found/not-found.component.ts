import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section" aria-labelledby="nf-title">
      <div class="container-page text-center max-w-xl">
        <p class="eyebrow">Erro 404</p>
        <h1 id="nf-title" class="mt-3">Página não encontrada</h1>
        <p class="mt-4 text-brand-700">
          O conteúdo que você procura pode ter sido movido ou não existe.
        </p>
        <a routerLink="/" class="btn-primary mt-8 inline-flex">Voltar ao início</a>
      </div>
    </section>
  `,
})
export class NotFoundComponent {}
