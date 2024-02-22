function angleBetweenThreePoints(pos) {

  var a = Math.pow(pos[1].x - pos[0].x, 2) + Math.pow(pos[1].y - pos[0].y, 2);
  var b = Math.pow(pos[1].x - pos[2].x, 2) + Math.pow(pos[1].y - pos[2].y, 2);
  var c = Math.pow(pos[2].x - pos[0].x, 2) + Math.pow(pos[2].y - pos[0].y, 2);


  //angle in degrees
  var resultDegree =
    (Math.acos((a + b - c) / Math.sqrt(4 * a * b)) * 180) / Math.PI;
  return resultDegree;
}

export default angleBetweenThreePoints;