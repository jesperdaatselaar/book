export interface BasicCustomer {
  id: number;
}

export interface Customer extends BasicCustomer {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}
