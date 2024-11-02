import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [RouterModule],
  template: `
     <main class="w-full h-full p-4 sm:p-6 overflow-y-auto" (click)="toggleSidebar()">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class MainContentComponent {

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.remove('open');
  }
}
