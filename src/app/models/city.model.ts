import { State } from './state.model';

export interface City {
  id?: number;
  name?: string;
  state?: State;
  dateCreated?: Date;
  lastUpdated?: Date;
}
