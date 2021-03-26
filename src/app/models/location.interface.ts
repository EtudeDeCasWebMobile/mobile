export class LocationInterface {

  image: string;
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;

  collections?: {
    id: number,
    locations: any [],
    tag: string
    owner: {
      email: string,
      id: number,
      position: {
        id: number,
        latitude: string,
        longitude: string
      }
    }
  }[];
  owner?: {
    id: number,
    email: string,
    position: {
      id: number,
      latitude: string,
      longitude: string
    }
  };

}
