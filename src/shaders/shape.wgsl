struct Fragment {
    @builtin(position) Position : vec4<f32>,
    @location(0) Color : vec4<f32>
};

@group(0) @binding(0)
var<uniform> projectionMatrix: mat4x4f;

@vertex
fn vs_main(@location(0) vertexPosition: vec2<f32>, @location(1) vertexColor: vec3<f32>) -> Fragment {
  var output : Fragment;
  output.Position = vec4f(vertexPosition, 0.0, 1.0);
  output.Color = vec4f(vertexColor, 1.0);

  return output;
}

@fragment
fn fs_main(@location(0) Color: vec4<f32>) -> @location(0) vec4<f32> {
    return Color;
}