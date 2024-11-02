import { Component, OnInit, } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IUser } from '../../models/user.interface';

@Component({
  selector: 'app-layouts',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './layouts.component.html',
  styleUrl: './layouts.component.css'
})
export class LayoutsComponent implements OnInit {
  currentUser!: IUser;
  isLoading: boolean = true;

  ngOnInit(): void {
    
  }
 
}
