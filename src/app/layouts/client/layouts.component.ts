import { Component, OnDestroy, OnInit, } from '@angular/core';
import { IUser } from '../../models/user.interface';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../components/loader/loader.component';
import { FeatherService } from '../../services/feather.service';
import { Subject, takeUntil } from 'rxjs';
import { LayoutStateService } from '../../services/layout-state.service';


@Component({
  selector: 'app-layouts',
  standalone: true,
  imports: [SideBarComponent, HeaderComponent, FooterComponent, MainContentComponent, CommonModule, LoaderComponent],
  templateUrl: './layouts.component.html',
  styleUrl: './layouts.component.css'
})
export class LayoutsComponent implements OnInit, OnDestroy {
  currentUser!: IUser;
  isLoading: boolean = true;
  isOpen = false;
  userName!: string;
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private featherService: FeatherService,
    private layoutStateService: LayoutStateService
  ) {}

  ngOnInit() {
    this.featherService.initFeather();
    this.loadCurrentUser();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCurrentUser() {
    this.userService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          if (user) {
            this.currentUser = user;
            this.layoutStateService.setCurrentUser(user);
            this.userName = user.name;
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.error('Erreur lors du chargement de l\'utilisateur:', error);
          this.isLoading = false;
        }
      });
  }
}