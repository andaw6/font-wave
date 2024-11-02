import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserAuthService } from '../../../services/user-auth.service';
import { UserRole } from '../../../enums/UserRole';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  phone: string = '';
  password: string = '';
  showQRCode: boolean = false;
  userId: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private userAuthService: UserAuthService
  ) { }

  onLogin(event: Event) {
    event.preventDefault();
    this.isLoading = true;

    const credentials = {
      phone: this.phone,
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Réponse complète:', response);
        console.log('Structure de la réponse:', {
          hasData: !!response.data,
          hasToken: !!response.data?.token,
          userData: response.data?.user
        });

        if (response.data?.token) {
          try {
            localStorage.setItem('token', response.data.token);

            const { role } = this.userAuthService.decodeToken();

            let url = ([UserRole.ADMIN, UserRole.AGENT].includes(role as UserRole)) ? 'admin' : role?.toLowerCase();

            console.log(`Tentative de redirection vers: /${url}/dashboard`);

            this.router.navigate([`/${url}/dashboard`]).then(
              (success) => {
                console.log('Résultat de la navigation:', success);
                if (!success) {
                  console.error('La navigation a échoué - Route non trouvée ou non accessible');
                }
                this.isLoading = false;
              },
              (error) => {
                console.error('Erreur lors de la navigation:', error);
                this.isLoading = false;
              }
            );
            localStorage.setItem('userId', response.data.user.id);

          } catch (err) {
            console.error('Erreur détaillée:', err);
            this.isLoading = false;
            this.snackBar.open('Une erreur est survenue', 'Fermer', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        } else {
          console.error('Structure de réponse invalide:', response);
          this.isLoading = false;
          this.snackBar.open('Erreur: Token manquant', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur détaillée:', error);
        this.isLoading = false;
        this.showQRCode = false;

        let errorMessage = 'Une erreur est survenue';

        if (error.status === 0) {
          errorMessage = 'Impossible de contacter le serveur';
        } else if (error.status === 401) {
          errorMessage = 'Identifiants incorrects';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        this.snackBar.open(errorMessage, 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onRegister() {
    this.router.navigate(['/register'])
      .then(() => console.log('Navigation vers register réussie'))
      .catch(err => console.error('Erreur navigation vers register:', err));
  }
  ngOnInit() {

    if (this.userAuthService.getToken()) {
      // Lors du chargement de la page de connexion, effectuer une déconnexion complète
      this.authService.logout().subscribe({
        next: () => {
          // Nettoyage des informations d'authentification côté client
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          console.log('Déconnexion réussie');
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erreur lors de la déconnexion côté serveur:', error);
        }
      });
    }
  }
}

