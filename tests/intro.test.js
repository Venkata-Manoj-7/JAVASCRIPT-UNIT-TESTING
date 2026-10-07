import {describe,test,it,expect} from "vitest";
import {max} from "../src/intro";

describe('max',()=>{
    it("should return first arugment if  it is greter ",()=>{
        const a =2;
        const b = 1;
        const result=max(a,b);
        expect(result).toBe(2);

    });

    it("should return second argumnet it it is greter",()=>{
        expect(max(1,2)).toBe(2);
    });
    it("should return first argumnet if arguments are equal",()=>{
        expect(max(1,1)).toBe(1);
    });

})