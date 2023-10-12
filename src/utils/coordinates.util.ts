import { mat3, vec2 } from 'gl-matrix'

export function getProjection(width: number, height: number): mat3 {
  return mat3.projection(mat3.create(), width, height)
}

export function convertScreenToWorldPoint(
  xScreen: number,
  yScreen: number,
  width: number,
  height: number,
  projection: mat3
): [number, number] {
  const clipCoord: vec2 = vec2.fromValues(
    (2.0 * xScreen) / width - 1.0,
    1.0 - (2.0 * yScreen) / height
  )

  const worldVec = vec2.transformMat3(
    vec2.create(),
    clipCoord,
    mat3.invert(mat3.create(), projection)
  )

  return [worldVec[0], worldVec[1]]
}

export function convertWorldToScreenPoint(
  xWorld: number,
  yWorld: number,
  width: number,
  height: number,
  projection: mat3
): [number, number] {
  const clipCoord: vec2 = vec2.transformMat3(
    vec2.create(),
    vec2.fromValues(xWorld, yWorld),
    projection
  )

  const screenVec = vec2.fromValues(
    ((1.0 + clipCoord[0]) * width) / 2.0,
    ((1.0 - clipCoord[1]) * height) / 2.0
  )

  return [Math.round(screenVec[0]), Math.round(screenVec[1])]
}
