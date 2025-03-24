import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { CredencialesLogin } from '../../interfaces/login.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formLogin: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder, private router:Router) {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  iniciarSesion() {
    const credenciales:CredencialesLogin = {
      email: this.formLogin.get('email')?.value,
      password: this.formLogin.get('password')?.value
    };
    this.authService.login(credenciales).subscribe({
      next: r => this.router.navigate(['/administrador']),
      error: e => console.error('Error en la autenticacion', e)
    })
  }

}
