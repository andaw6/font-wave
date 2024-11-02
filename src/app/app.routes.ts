import { Routes } from '@angular/router';
import { RoleGuard } from './security/role.guard';
import { UserRole } from './enums/UserRole';
import { AuthGuard } from './security/auth.guard';

import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';

import { DashboardComponent as ClientDashboardComponent } from './pages/client/dashboard/dashboard.component';
import { DashboardComponent as AdminDashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { DashboardComponent as VendorDashboardComponent } from './pages/vendor/dashboard/dashboard.component';

import { LayoutsComponent as ClientLayoutComponent } from './layouts/client/layouts.component';
import { LayoutsComponent as AdminLayoutComponent } from './layouts/admin/layouts.component';
import { LayoutsComponent as VendorLayoutComponent } from './layouts/vendor/layouts.component';

import { TransactionsComponent as ClientTransactionsComponent } from './pages/client/transactions/transactions.component';
import { TransactionDetailComponent } from './pages/client/transaction-detail/transaction-detail.component';
import { BuyCreditComponent } from './pages/client/buy-credit/buy-credit.component';
import { TransfertComponent } from './pages/client/transfert/transfert.component';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.AGENT] },
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
    ]
  },
  {
    path: 'client',
    component: ClientLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.CLIENT] },
    children: [
      { path: 'dashboard', component: ClientDashboardComponent },
      { path: 'transactions', component: ClientTransactionsComponent },
      { path: 'transactions/credit', component: BuyCreditComponent },
      { path: 'transactions/transfert', component: TransfertComponent },
      { path: 'transactions/:id', component: TransactionDetailComponent },
    ]
  },
  {
    path: 'vendor',
    component: VendorLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.VENDOR] },
    children: [
      { path: 'dashboard', component: VendorDashboardComponent },
    ]
  }
];
