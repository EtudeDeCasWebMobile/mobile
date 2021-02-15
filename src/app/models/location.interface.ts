import {CoordinateInterface} from './coordinate.interface';

export class LocationInterface {

  coordinate: CoordinateInterface;
  title: string;
  description: string;
  tags: unknown[];
  image: string;

}
