export interface CredencialesLogin {
  email: string,
  password: string
}

export interface LoginResponse {
  email: string,
  rol: string,
  token: string
}
