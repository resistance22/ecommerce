export class User {
  public id: string
  public first_name: string
  public last_name: string
  public email: string
  public phone_number: string
  public registered_at: Date
  public updated_at: Date
  public email_confirmed: boolean
  public blocked: boolean
  public password: string

  constructor(userDTO: UserNS.DTO.IUser) {
    this.id = userDTO.id
    this.first_name = userDTO.first_name
    this.last_name = userDTO.last_name
    this.email = userDTO.email
    this.phone_number = userDTO.phone_number
    this.registered_at = new Date(userDTO.registered_at)
    this.updated_at = new Date(userDTO.updated_at)
    this.email = userDTO.email
    this.blocked = userDTO.blocked
    this.password = userDTO.password
    this.email_confirmed = userDTO.email_confirmed
  }
}

export const makeUserfromDTO: (userDTO: UserNS.DTO.IUser) => User = (userDTO) => {
  return new User(userDTO)
}
