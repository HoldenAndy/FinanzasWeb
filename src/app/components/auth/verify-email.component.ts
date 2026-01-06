import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  verifyForm: FormGroup;
  loading = false;
  error: string | null = null;
  userEmail = this.authService.currentUser?.email || '';

  constructor() {
    this.verifyForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  get code() {
    return this.verifyForm.get('code');
  }

  onSubmit(): void {
    if (this.verifyForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.authService.verifyEmail({
      email: this.userEmail,
      code: this.verifyForm.value.code
    }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Código de verificación inválido.';
      }
    });
  }

  onCodeChange(event: any): void {
    const input = event.target.value.replace(/\D/g, '').slice(0, 6);
    this.verifyForm.patchValue({ code: input });
  }
}
