class Gradient{
  constructor(){
      this.x = [];
      this.y = [];
      this.h = [];
      this.s = [];
      this.v = [];
      this.points = [];
  }

  addPoint(x,y,h,s,v){
    this.x.push(x);
    this.y.push(x);
    this.h.push(x);
    this.s.push(x);
    this.v.push(x);
    this.points.push(new ColorPoint(x,y,h,s,v));
  }

  getPoint(x,y){
    var distance = [];
    var distanceSum = 0;
    for(var i = 0; i < this.points.length; i++){
      distanceResult = this.getDistance(x,y,this.points[i].x(),this.points[i].y());
      distance.push(distanceResult);
      distanceSum += distanceResult;
    }

    var ratio = []
    for(var i = 0; i < this.points.length; i++){
      ratioResult = distance[i] / distanceSum;
      ratio.push(ratioResult);
    }
    var color = points[0].getHSV();
    for(var i = 1; i < this.points.length; i++){

    }
    return color;
  }

  getDistance(x1,y1,x2,y2){
    var dist = sqrt(pow(x2 - x1,2)+pow(y2 - y1,2))
    return dist
  }

}

class ColorPoint{
  constructor(x,y,h,s,v){
      this.cordinates = [x,y];
      this.color = [h,s,v];
  }

  x(){
    return this.cordinates[0]
  }

  y(){
    return this.cordinates[1]
  }

  setHSV(h,s,v){
    this.color[0] = h;
    this.color[0] = s;
    this.color[0] = v;
  }

  getColor(){
    return hslToRgb(this.color[0],this.color[1],this.color[2]);
  }

  getHSV(){
    return this.color
  }
}

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
