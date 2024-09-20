export interface UserRegist {
  id?: string;
  name: string;
  surname: string;
  email: string;
  password?: string;
  passwordConfirm?: string;
  rating?: number;
  role?: string;
}
