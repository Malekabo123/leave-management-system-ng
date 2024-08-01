import { Component, inject } from '@angular/core';
import { SidebarService } from '../services/sidebar.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  private sidebarService = inject(SidebarService);
  name = localStorage.getItem('theNameOfEmployeeLoggedIn');

  get isCollapsed() {
    return this.sidebarService.isCollapsed;
  }

  toggleSidebar(isCollapsed: boolean) {
    this.sidebarService.toggleSidebar(isCollapsed);
  }
}
