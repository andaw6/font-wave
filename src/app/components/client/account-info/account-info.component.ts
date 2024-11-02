import { AfterViewInit, Component, input, Input, OnInit } from '@angular/core';
import { FormatBalancePipe } from '../../../pipes/format-balance.pipe';
import { CommonModule } from '@angular/common';
import { IUserSettings } from '../../../models/user.interface';
import { RouterModule } from '@angular/router';
import { FeatherService } from '../../../services/feather.service';
import { ListIconComponent } from '../list-icon/list-icon.component';

@Component({
  selector: 'app-account-info',
  standalone: true,
  imports: [FormatBalancePipe, CommonModule, RouterModule, ListIconComponent],
  templateUrl: './account-info.component.html',
  styleUrl: './account-info.component.css'
})
export class AccountInfoComponent implements OnInit, AfterViewInit {
  @Input({ required: true }) user!: IUserSettings;

  showPlatfond: boolean = true;
  currentDate!: Date;

 


  togglePlatfond() {
    this.showPlatfond = !this.showPlatfond;
  }

  constructor(private featherService: FeatherService) { }

  ngOnInit() {
    this.currentDate = new Date();
  }


  ngAfterViewInit() {
    this.featherService.initFeather(); 
  }

}


