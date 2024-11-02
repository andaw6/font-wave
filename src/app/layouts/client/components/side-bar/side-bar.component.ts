import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAuthService } from '../../../../services/user-auth.service';
import { UserRole } from '../../../../enums/UserRole';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements OnInit {
  @Input({ required: true }) name!: string;
  role!: UserRole;

  constructor(private authService: UserAuthService, private router: Router) { }

  ngOnInit(): void {
    const { role } = this.authService.decodeToken();
    this.role = role as UserRole;
  }


  isCurrentRoute(route: string): boolean {
    return this.router.url === route;
  }
}
