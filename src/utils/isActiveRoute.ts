export function isActiveRoute(pathname: string, route: string): boolean {
  if (pathname === route) {
    return true;
  }
  
  if (route !== '/' && pathname.startsWith(route + '/')) {
    return true;
  }
  
  return false;
}
