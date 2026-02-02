export interface UserProfile {
  avatar: string;
  bio: string;
  phone: string;
  theme: 'light' | 'dark' | 'system';
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'customer';
  profile?: UserProfile;
  created_at: string;
}