import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-gray-800 text-center p-4 text-gray-300">
      <p>&copy; 2024 Wave Sénégal. Tous droits réservés.</p>
    </footer>
  `
})
export class FooterComponent { }