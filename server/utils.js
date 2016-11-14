
const R = 6371; // =It doesn't get changed aslong as I remember

const toRadians = (degrees) => degrees * Math.PI/180;

const toDegrees = (radian) => radian * 180 / Math.PI;

/*
Haversine formula:
a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
c = 2 ⋅ atan2( √a, √(1−a) )
d = R ⋅ c
*/
export const computeHaversineDistance = (sLat,sLong) => {
    return (tLat,tLong)=>{
        sLat = toRadians(sLat);
        sLong = toRadians(sLong);
        tLat = toRadians(tLat);
        tLong = toRadians(tLong);
        let dLat = tLat-sLat;
        let dLon = tLong-sLong;

        let a = Math.sin(dLat/2)*Math.sin(dLat/2)
                +Math.cos(sLat)*Math.cos(tLat)
                * Math.sin(dLon/2)*Math.sin(dLon/2);


        let c = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a));

        let d = R * c;
        return d;
    }
}

export const compose2 = (f) => (g) => (x) => f(g(x))

//Took from redux
export const compose = (...func) => {
  if(func.length === 0){
    return new Error(' need to provide argument')
  }

  if(func.length === 1){
    return func[0];
  }

  const last = func[func.length - 1];
  const rest = func.splice(0,func.length - 1);
  return (...args)=> rest.reduceRight((composed,f)=>f(composed),last(...args))
}
