import { Component, signal, inject, ChangeDetectionStrategy, WritableSignal, computed, effect } from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { passwordsMatch, strongPassword } from '../../../../core/validators/passwordValidators';

import { AuthService } from '../../../../core/services/auth.service';
import { RegisterRequest } from '../../../../core/models/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DataUrl, NgxImageCompressService } from 'ngx-image-compress';
import { ImageCompressorService } from '../../../../core/services/image-compressor.service';
import { ErrorTypes } from '../../../../core/models/register-errors.enum';

@Component({
  selector: 'app-register',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  public readonly loading: WritableSignal<boolean> = signal(false);
  public readonly passwordFocused = signal(false);
  public readonly passwordTouched = signal(false);

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  public readonly form: FormGroup = this.fb.group(
    {
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, strongPassword()]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch('password', 'confirmPassword') }
  );

  public onPasswordFocus(): void {
    this.passwordFocused.set(true);
  }

  public onPasswordBlur(): void {
    this.passwordFocused.set(false);
    this.passwordTouched.set(true);
  }

  public getPasswordValue(): string {
    return this.form.get('password')?.value || '';
  }

  public hasMinLength(): boolean {
    const password = this.getPasswordValue();
    return password.length >= 6 && password.length <= 8;
  }

  public hasLowercase(): boolean {
    return /[a-z]/.test(this.getPasswordValue());
  }

  public hasUppercase(): boolean {
    return /[A-Z]/.test(this.getPasswordValue());
  }

  public hasNumber(): boolean {
    return /[0-9]/.test(this.getPasswordValue());
  }

  public hasSymbol(): boolean {
    return /[!@#$%^&*(),.?":{}|<>]/.test(this.getPasswordValue());
  }

  public getRequirementStatus(requirement: () => boolean): 'valid' | 'invalid' | 'pending' {
    if (!this.passwordTouched() && !this.passwordFocused()) {
      return 'pending';
    }
    if (this.passwordFocused()) {
      return requirement() ? 'valid' : 'pending';
    }
    return requirement() ? 'valid' : 'invalid';
  }

  public async submit(): Promise<void> {
    if (this.form.invalid) {
      this.showMessage('Por favor, preencha todos os campos corretamente', 'error');
      return;
    }
    this.loading.set(true);
    this.register();
  }

  public goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private register(): void {
    const payload = this.buildRegisterPayload();

    this.authService.register(payload).subscribe({
      next: (res: any): void => this.handleRegisterSuccess(res, payload),
      error: (err): void => this.handleRegisterError(err.error),
    });
  }

  private buildRegisterPayload(): RegisterRequest {  
    return {
      name: this.form.value.username!.trim(),
      email: this.form.value.email!,
      password: this.form.value.password!,
      matchPassword: this.form.value.password!,
    };
  }

  private handleRegisterSuccess(res: any, payload: RegisterRequest): void {
    const status = res?.status ?? res?.statusCode ?? res?.code;

    if (status === 201) {
      this.showMessage('Cadastro realizado com sucesso!', 'success');
      setTimeout(() => {
            this.showMessage('Foi enviado um email de confirmação para seu endereço de email', 'warning');
          }, 2000)
      this.loading.set(false);
      this.router.navigate(['/login']);
      // this.performAutoLogin(payload);
    } else {
      this.loading.set(false);
      this.showMessage('Cadastro realizado. Faça login para continuar.', 'info');
      this.router.navigate(['/login']);
    }
  }

  private handleRegisterError(err: any): void {
    this.loading.set(false);
    console.error('Erro ao criar usuário:', err);
    if (err.type == ErrorTypes.NOT_PERMITTED) {
      this.showMessage('Erro ao criar usuário. Já existe um usuário cadastrado com esse email', 'error');
    }
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    const config = {
      duration: 4000,
      horizontalPosition: 'end' as const,
      verticalPosition: 'top' as const,
      panelClass: [`snackbar-${type}`],
    };

    this.snackBar.open(message, 'Fechar', config);
  }
}
