import {atom} from 'jotai';
import { ItemQueue } from './model/item';

export const itemsAtom = atom(new ItemQueue());