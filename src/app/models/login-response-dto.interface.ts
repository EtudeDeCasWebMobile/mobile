import {LocationInterface} from './location.interface';

export class LoginResponseDtoInterface {


  email: string;
  id: number;
  position: {
    collections: {
      id: number,
      locations: LocationInterface[],
      tag: string
    }[],
    description: string;
    id: number;
    title: string;
  };

}
