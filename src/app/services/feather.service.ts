import { Injectable } from '@angular/core';

declare var feather: any;

@Injectable({
  providedIn: 'root',
})
export class FeatherService {
  constructor() {}

  initFeather() {
    feather.replace();
  }
}
