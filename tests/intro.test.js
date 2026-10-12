import {describe,test,it,expect} from "vitest";
import {max} from "../src/intro";
import { fizzBuzz } from "../src/intro";

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

});


describe('fizzBuzz', () => {
  it('should return FizzBuzz if arg is divisible by 3 and 5', () => {
    expect(fizzBuzz(15)).toBe('FizzBuzz');
  });

  it('should return Fizz if arg is only divisible by 3', () => {
    expect(fizzBuzz(3)).toBe('Fizz');
  });

  it('should return Buzz if arg is only divisible by 5', () => {
    expect(fizzBuzz(5)).toBe('Buzz');
  });

  it('should return arg as a string if it is not divisible by 3 or 5', () => {
    expect(fizzBuzz(1)).toBe('1');
  });
});