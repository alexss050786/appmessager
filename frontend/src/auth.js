export default function isAuthenticated() {
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  }

  return false;
}
