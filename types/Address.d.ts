export { }

declare global {
  declare namespace AddressNS {
    declare namespace DTO {
      interface IAddress {
        id: string | null
        first_line: string
        second_line: string | null
        country: string
        city: string
        state: string
        zip_code: string
        company: string | null
        created_at: string | null
        updated_at: string | null
      }
    }
  }
}