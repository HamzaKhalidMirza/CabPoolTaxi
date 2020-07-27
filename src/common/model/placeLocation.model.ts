export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PlaceLocation extends Coordinates {
  address: string;
  caption: string;
  staticMapImageUrl: string;
}
