import {it,describe,expect} from "vitest";
import {factorial} from "../src/TTD-Code";

describe('factorial',()=>{
    it("if 0 is passed as args it should return 1",()=>{
        expect(factorial(0)).toBe(1);
    });
    it("if 1 is passed as args it should return 1",()=>{
        expect(factorial(1)).toBe(1);
    });
     it("if 3 is passed as args it should return 6",()=>{
        expect(factorial(3)).toBe(6);
    });


});