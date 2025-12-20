/*
Defines the nouns (what a point is)
A tiny “vocabulary file” for geometry.
Gives names and structure to the basic objects you use everywhere.
*/
export type Point2D = {
  x: number;
  y: number;
};

export type Point3D = {
  x: number;
  y: number;
  z: number; // height
};