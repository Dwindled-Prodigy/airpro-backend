import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const adminGuard = () => {
  const router = inject(Router);
  const sessionStr = localStorage.getItem('airpro_session');
  
  if (sessionStr) {
    const session = JSON.parse(sessionStr);
    if (session.role === 'ADMIN') {
      return true;
    }
  }

  // Not an admin, redirect to home
  router.navigate(['/']);
  return false;
};
