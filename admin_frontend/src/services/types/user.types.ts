interface User {
  _id: string;
  name: string;
  email: string;
  authType: string;
  status: string;
  verify: boolean;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export type { User };
