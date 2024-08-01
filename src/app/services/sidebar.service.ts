import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  isCollapsed = true;

  toggleSidebar(isCollapsed: boolean) {
    this.isCollapsed = isCollapsed;
  }
}
