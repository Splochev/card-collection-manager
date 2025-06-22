export interface IUser {
  id: number
  email: string
  password?: string
  isVerified: boolean
  firstName?: string
  lastName?: string
  role: 'user' | 'admin'
}

export interface ICreateUser {
  email: string
  password?: string
  isVerified: boolean
  firstName?: string
  lastName?: string
  role: 'user' | 'admin'
}

export interface IUpdateUser {
  email?: string
  password?: string
  isVerified?: boolean
  firstName?: string
  lastName?: string
  role?: 'user' | 'admin'
}

export interface IGetUser extends IUser {
  id: number
  email: string
  isVerified: boolean
  firstName?: string
  lastName?: string
  role: 'user' | 'admin'
}
