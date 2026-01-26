export interface Student {
  studentId?: string;
  studentName: string;
  age: number;
  groupNumber: number;
}

export interface User {
  userId?: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  roleId?: number;
}

export interface UserLogin extends Pick<User, 'email' | 'password'> {}
