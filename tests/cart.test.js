import {describe,it,expect} from 'vitest';
import { calculateTotal } from '../src/cart';

describe("1. Boundary condition smin max",()=>{
    it(" o% discount need to get same prize",()=>{
         const items = [{ price: 100, quantity: 1 }];
         expect(calculateTotal(items,0)).toBe(100);
    });

    it(" 100 % discoun  nedd to get o ",()=>{
          const items = [{ price: 100, quantity: 1 }];
          except(calculateTotal(items,100)).tobe(0);
    });

    it(" thouew erro when disocunt not in range",()=>{
          const items = [{ price: 100, quantity: 1 }];
          except(calculateTotal(items,100)).toThrow(RangeError);
    })
})