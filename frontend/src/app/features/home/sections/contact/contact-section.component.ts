import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { siteConfig } from '../../../../core/config/site.config';
import { SectionTitleComponent } from '../../../../shared/components/section-title/section-title.component';
import { WhatsAppService } from '../../../../core/services/whatsapp.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, SectionTitleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="contato" class="section bg-surface-muted" aria-labelledby="contact-title">
      <div class="container-page grid gap-10 md:grid-cols-2">
        <div>
          <app-section-title
            eyebrow="Contato"
            title="Fale com a Dra. Bruna"
            subtitle="O WhatsApp é o canal preferencial. Também estamos no Instagram e no Linktree."
          />

          <ul class="space-y-4">
            <li class="flex items-center gap-3">
              <lucide-angular name="message-circle" [size]="20" aria-hidden="true"></lucide-angular>
              <a
                [href]="whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="font-semibold text-brand-800"
                (click)="trackWhatsApp($event)"
              >
                {{ siteConfig.contact.whatsappDisplay }}
              </a>
            </li>
            <li class="flex items-center gap-3">
              <lucide-angular name="instagram" [size]="20" aria-hidden="true"></lucide-angular>
              <a
                [href]="siteConfig.contact.instagramUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="font-semibold text-brand-800"
              >
                {{ siteConfig.contact.instagramHandle }}
              </a>
            </li>
            <li class="flex items-center gap-3">
              <lucide-angular name="link" [size]="20" aria-hidden="true"></lucide-angular>
              <a
                [href]="siteConfig.contact.linktreeUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="font-semibold text-brand-800"
              >
                Linktree completo
              </a>
            </li>
          </ul>
        </div>

        <form
          [formGroup]="form"
          (ngSubmit)="submit()"
          class="card space-y-4"
          aria-labelledby="contact-form-title"
          novalidate
        >
          <h3 id="contact-form-title" class="font-display">Mensagem</h3>

          @if (!environment.production) {
            <p class="text-xs rounded-lg bg-accent-50 text-accent-800 p-3">
              Modo desenvolvimento: o envio por formulário encaminha a mensagem para o WhatsApp,
              sem simular sucesso ou armazenamento.
            </p>
          }

          <label class="block">
            <span class="text-sm text-brand-700">Nome</span>
            <input
              type="text"
              formControlName="name"
              class="mt-1 w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm
                     focus:border-brand-500"
              autocomplete="name"
              required
            />
            @if (hasError('name', 'required')) {
              <span class="text-xs text-red-700">Informe seu nome.</span>
            }
          </label>

          <label class="block">
            <span class="text-sm text-brand-700">Mensagem</span>
            <textarea
              formControlName="message"
              rows="4"
              class="mt-1 w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm
                     focus:border-brand-500"
              required
            ></textarea>
            @if (hasError('message', 'required')) {
              <span class="text-xs text-red-700">Escreva sua mensagem.</span>
            }
          </label>

          <button type="submit" class="btn-primary w-full" [disabled]="form.invalid">
            <lucide-angular name="send" [size]="18" aria-hidden="true"></lucide-angular>
            Enviar via WhatsApp
          </button>

          <p class="text-xs text-brand-500">
            Ao enviar, sua mensagem será aberta no WhatsApp. Nenhum dado é armazenado neste
            momento.
          </p>
        </form>
      </div>
    </section>
  `,
})
export class ContactSectionComponent {
  protected readonly siteConfig = siteConfig;
  protected readonly environment = environment;
  private readonly fb = inject(FormBuilder);
  private readonly whatsapp = inject(WhatsAppService);
  private readonly router = inject(Router);

  readonly whatsappUrl = signal(this.whatsapp.buildUrl());

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  hasError(control: 'name' | 'message', error: string): boolean {
    const c = this.form.controls[control];
    return c.touched && c.hasError(error);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, message } = this.form.getRawValue();
    const greeting = `Olá, Dra. Bruna! Meu nome é ${name}. ${message}`;
    const url = this.whatsapp.track(this.router.url, greeting);
    this.whatsappUrl.set(url);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  trackWhatsApp(event: MouseEvent): void {
    const url = this.whatsapp.track(this.router.url);
    (event.currentTarget as HTMLAnchorElement).href = url;
    this.whatsappUrl.set(url);
  }
}
