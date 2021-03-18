export interface CollectionInterface {
  id: number;
  locations: {
    collections: string[];
    description: string;
    id: number,
    owner: {
      email: string,
      id: number
    },
    title: string;
  }[];
  owner: {
    email: string,
    id: number
  };
  tag: string;
}
