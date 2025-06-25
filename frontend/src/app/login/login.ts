import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  loginForm: FormGroup;
  errorMessage: string | null = null;
  showPassword: boolean = true;
  
  constructor(
    private title: Title, 
    private fb: FormBuilder,
    private auth: AuthService, 
    private router: Router){
    this.title.setTitle('Login user');
    // Membuat form group untuk login
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[a-zA-Z0-9\s!@#$&%_]*$/)]],
    });
    // Cek apakah pengguna sudah login
    if(this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']); // Arahkan ke halaman utama atau dashboard jika sudah login
      return; // Hentikan proses login jika sudah login
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      // this.sanitizeInput(this.loginForm.value.password);
      const credentials = this.loginForm.value;

      this.auth.login(credentials).subscribe({
        next: (response) => {
          console.log('response : ', response)
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.log('error message ', error.message)
        }
      })
    }
  }

  // Fungsi sanitasi tambahan untuk mencegah XSS
  sanitizeInput(input: string): string {
    const temp = document.createElement('div');
    temp.textContent = input;
    return temp.innerHTML;
  }

}
