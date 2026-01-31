declare module '*.css';

declare module 'leaflet-gesture-handling' {
  import * as L from 'leaflet';
  export class GestureHandling extends L.Handler {
    enable(): this;
    disable(): this;
  }
}