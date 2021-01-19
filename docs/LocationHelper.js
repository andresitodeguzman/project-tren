/**
 * RilesState
 * 2018
 * 
 * Helper
 * 
 * LocationHelper
 */

 class LocationHelper {

    /**
     * approximateTime
     * @param {Number} d // Must be in meters
     * @param {Number} s // Must be in m/s
     */
    approximateTime(d,s){
        var distance = +d;
        var speed = +s;
        var time = distance/speed;
        if(isNaN(time)) time = 0;
        return time;
    }

    /**
     * kmToMeters
     * @param {Number} i // Must be in km
     */
    kmToMeters(i){
        var c = +i;
        return c*1000;
    }

    /**
     * metersToKm
     * @param {Number} i // Must be in meters
     */
    metersToKm(i){
        var c = +i;
        return c/1000;
    }

    /**
     * degToRad
     * Converts numeric degrees to radians
     * @param {Number} i 
     */
    degToRad(i){
        return +i * Math.PI / 180;    
    }

    /**
     * distance
     * @param {Number} lat1 // From lat
     * @param {Number} lon1 // From Long
     * @param {Number} lat2 // To Lat
     * @param {Number} lon2 // From Lat
     */
    distance(lat1, lon1, lat2, lon2){
        var R = 6371;
        var dLat = this.degToRad(lat2-lat1);
        var dLon = this.degToRad(lon2-lon1);
        var lat1 = this.degToRad(lat1);
        var lat2 = this.degToRad(lat2);

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c;
        return d;
    }

    /**
     * nearest
     * @param {Number} lat 
     * @param {Number} lon 
     * @param {Array} list // must contain 'latitude' and 'longitude' per elem
     */
    nearest(lat,lon,list){
        var mindif = 99999;
        var closest;
        for (var index = 0; index < list.length; ++index) {
			var dif = this.PythagorasEquirectangular(lat, lon, list[index].latitude, list[index].longitude);
			if (dif < mindif) {
			  closest = index;
			  mindif = dif;
			}
		}	
		return list[closest];
    }

    /**
     * PythagorasEquirectangular
     * @param {Number} lat1 
     * @param {Number} lon1 
     * @param {Number} lat2 
     * @param {Number} lon2 
     */
    PythagorasEquirectangular(lat1, lon1, lat2, lon2){
        lat1 = this.degToRad(lat1);
        lat2 = this.degToRad(lat2);
        lon1 = this.degToRad(lon1);
        lon2 = this.degToRad(lon2);
        var R = 6371; // Earth's radius in km
        var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
        var y = (lat2 - lat1);
        var d = Math.sqrt(x * x + y * y) * R;
        return d;
    }

    /**
     * timeFormatter
     * @param {Number} secDouble //Seconds in double
     */
    timeFormatter(secDouble){
        var sec = +secDouble;
        var min = sec/60;
        var h = min/60;

        var time = {
            "hour":Math.trunc(h),
            "minutes":Math.trunc(min),
            "seconds":Math.trunc(sec)
        };
        return time;
    }

    /**
     * getApproximateTime
     * @param {Number} distance 
     * @param {Number} speed 
     */
    getApproximateTime(distance,speed){
        distance = +distance*1000;
        var time = +distance / +speed;
        time = +time/60;
        if(isNaN(time)) time = 0;
        return time;
    }

    /**
     * describeSpeed
     * @param {Number} speed 
     */
    describeSpeed(speed){
        var between = (x,min,max)=> {
            return x >= min && x <= max;
        }
        s = +speed;
        if(isNaN(s)) return "NOT_AVAILABLE";
        if(between(s,0,2)) return "STOP";
        if(between(s,2,3.7)) return "GAINING_SPEED";
        if(s > 3.7) return "MOVING";
    }

    /**
     * transformSpeed
     * @param {Number} speed 
     */
    transformSpeed(speed){
        var s = +speed;
        var c = +3.7;
        if(isNaN(s)) return c;
        if(s < c) return c;
        if(s == c) return s;
        if(s > c) return s; 
    }

    doorWillOpen(bound, d) {
        if(bound === 'northbound') {
            switch(d) {
                case('S'):
                    return 'left';
                    break;
                case('SE'):
                    return 'back';
                    break;
                case('SW'):
                    return 'front';
                    break;
                case('N'):
                    return 'right';
                    break;
                case('NE'):
                    return 'front';
                    break;
                case('NW'):
                    return 'back';
                    break;
                case('E'):
                    return 'front';
                    break;
                case('W'):
                    return 'back';
                    break;
            }
        } else {
            switch(d) {
                case('S'):
                    return 'right';
                    break;
                case('SE'):
                    return 'front';
                    break;
                case('SW'):
                    return 'back';
                    break;
                case('N'):
                    return 'left';
                    break;
                case('NE'):
                    return 'back';
                    break;
                case('NW'):
                    return 'front';
                    break;
                case('E'):
                    return 'back';
                    break;
                case('W'):
                    return 'front';
                    break;
            }
        }
    }

    getCardinal(angle) {
        /** 
         * Customize by changing the number of directions you have
         * We have 8
         */
        const degreePerDirection = 360 / 8;
        /** 
         * Offset the angle by half of the degrees per direction
         * Example: in 4 direction system North (320-45) becomes (0-90)
         */
        const offsetAngle = angle + degreePerDirection / 2;
        return (offsetAngle >= 0 * degreePerDirection && offsetAngle < 1 * degreePerDirection) ? "S"
          : (offsetAngle >= 1 * degreePerDirection && offsetAngle < 2 * degreePerDirection) ? "SW"
            : (offsetAngle >= 2 * degreePerDirection && offsetAngle < 3 * degreePerDirection) ? "E"
              : (offsetAngle >= 3 * degreePerDirection && offsetAngle < 4 * degreePerDirection) ? "NE"
                : (offsetAngle >= 4 * degreePerDirection && offsetAngle < 5 * degreePerDirection) ? "N"
                  : (offsetAngle >= 5 * degreePerDirection && offsetAngle < 6 * degreePerDirection) ? "NW"
                    : (offsetAngle >= 6 * degreePerDirection && offsetAngle < 7 * degreePerDirection) ? "W"
                      : "SE";
    }

    
}