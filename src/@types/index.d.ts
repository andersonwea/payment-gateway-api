export interface User {
  id: string
  name: string
  email: string
  password: string
}

export interface DecodeResult {
  token: string
  expires: number
  issued: number
}
