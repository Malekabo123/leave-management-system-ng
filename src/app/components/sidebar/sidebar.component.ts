import { Component, inject, Input } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { adminNavs } from '../../models/navs.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private sidebarService = inject(SidebarService);
  isAdmin = localStorage.getItem('yourRoleInThisCompany') === 'admin';
  navs = this.isAdmin
    ? adminNavs
    : adminNavs.filter((nav) => nav.title !== 'User Management');

  name = localStorage.getItem('theNameOfEmployeeLoggedIn');

  get isCollapsed() {
    return this.sidebarService.isCollapsed;
  }

  toggleSidebar(isCollapsed: boolean) {
    this.sidebarService.toggleSidebar(isCollapsed);
  }
}
