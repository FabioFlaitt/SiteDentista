import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="min-h-screen bg-surface-muted flex items-center justify-center p-4">
      <form
        [formGroup]="form"
        (ngSubmit)="submit()"
        class="w-full max-w-sm bg-white rounded-2xl shadow-card border border-brand-100 p-8 space-y-5"
        aria-labelledby="login-title"
        novalidate
      >
        <header class="text-center space-y-1">
          <div
            class="inline-flex w-12 h-12 rounded-xl bg-brand-50 text-brand-700 items-center
                   justify-center"
            aria-hidden="true"
          >
            <lucide-angular name="lock" [size]="22"></lucide-angular>
          </div>
          <h1 id="login-title" class="font-display text-2xl">Painel administrativo</h1>
          <p class="text-sm text-brand-600">Acesso restrito.</p>
        </header>

        <label class="block">
          <span class="text-sm text-brand-700">E-mail</span>
          <input
            type="email"
            formControlName="email"
            autocomplete="username"
            class="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
            required
          />
          @if (showError('email', 'required')) {
            <span class="text-xs text-red-700">Informe o e-mail.</span>
          }
          @if (showError('email', 'email')) {
            <span class="text-xs text-red-700">E-mail inválido.</span>
          }
        </label>

        <label class="block">
          <span class="text-sm text-brand-700">Senha</span>
          <input
            type="password"
            formControlName="password"
            autocomplete="current-password"
            class="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
            required
          />
          @if (showError('password', 'required')) {
            <span class="text-xs text-red-700">Informe a senha.</span>
          }
        </label>

        @if (errorMessage()) {
          <div class="rounded-lg bg-red-50 text-red-800 text-sm p-3" role="alert">
            {{ errorMessage() }}
          </div>
        }

        <button type="submit" class="btn-primary w-full" [disabled]="loading()">
          @if (loading()) {
            <span>Entrando…</span>
          } @else {
            <span>Entrar</span>
          }
        </button>
      </form>
    </section>
  `,
})
export class AdminLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  showError(control: 'email' | 'password', error: string): boolean {
    const c = this.form.controls[control];
    return c.touched && c.hasError(error);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorMessage.set(null);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/admin/dashboard';
        void this.router.navigateByUrl(returnUrl);
      },
      error: (err: { status?: number }) => {
        this.loading.set(false);
        this.errorMessage.set(
          err?.status === 401
            ? 'Credenciais inválidas.'
            : 'Não foi possível realizar o login. Tente novamente.',
        );
      },
    });
  }
}
