export interface BasicUser {
  id: number;
}

export interface User extends BasicUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}
