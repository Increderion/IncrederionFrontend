export interface Company {
  id: string;
  name: string;
  nip: string;
  krs: string;
  address: string;
  city: string;
  postalCode: string;
  type: string;
  status: "active" | "inactive";
}
