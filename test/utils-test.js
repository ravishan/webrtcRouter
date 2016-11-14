import expect from 'expect.js';
import {computeHaversineDistance,compose}  from './../server/utils';

describe("HaversineDistance",()=>{
  it("Should compute the distance between two lattitude and logitude",()=>{
    let slat = 52.205;
    let slong = 0.119;
    let tlat = 48.857;
    let tlong = 2.351;

    let distance = computeHaversineDistance(slat,slong)(tlat,tlong);

    expect(distance).to.be(404.2791639886792);
  });

  it("Should be commutative ",()=>{
    let slat = 52.205;
    let slong = 0.119;
    let tlat = 48.857;
    let tlong = 2.351;

    let distance = computeHaversineDistance(tlat,tlong)(slat,slong);

    expect(distance).to.be(404.2791639886792);
  });
});


describe("compose",()=>{
  it("Should compose",()=>{
    let a = (a)=> Math.pow(a,2);
    let b = (b)=> Math.pow(b,3);

    let c = compose(b,a);
    expect(c(2)).to.eql(64)
  })
})
