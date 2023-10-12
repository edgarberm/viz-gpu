export default class Rectangle {
  public buffer: GPUBuffer
  public bufferLayout: GPUVertexBufferLayout
  public vertices: Float32Array

  constructor(
    public device: GPUDevice,
    public position: Position,
    public size: Size,
    public color: RGBColor,
    public label?: string
  ) {
    const { x, y } = position
    const { width, height } = size
    const w = width
    const h = height

    /* prettier-ignore */
    this.vertices = new Float32Array([
      x, y - h,     ...color, // TL
      x + w, y - h, ...color, // BR
      x, y,         ...color, // BL

      x, y,         ...color, // TL
      x + w, y - h, ...color, // TR
      x + w, y,     ...color, // BR
    ])

    const usage: GPUBufferUsageFlags =
      GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST

    const descriptor: GPUBufferDescriptor = {
      label,
      size: this.vertices.byteLength,
      usage: usage,
      mappedAtCreation: true,
    }

    this.buffer = device.createBuffer(descriptor)
    new Float32Array(this.buffer.getMappedRange()).set(this.vertices)
    this.buffer.unmap()

    this.bufferLayout = {
      arrayStride: 20, // row_num * 4bytes
      // arrayStride: 20 * Float32Array.BYTES_PER_ELEMENT, // row_num * 4bytes
      attributes: [
        {
          shaderLocation: 0,
          format: 'float32x2',
          offset: 0,
        },
        {
          shaderLocation: 1,
          format: 'float32x3',
          offset: 8,
        },
      ],
    }
  }

  public render(shader: string, renderPass: GPURenderPassEncoder): void {
    const shaderModule = this.device.createShaderModule({ code: shader })
    const vertexState: GPUVertexState = {
      module: shaderModule,
      entryPoint: 'vs_main',
      // buffers: [],
      buffers: [this.bufferLayout],
    }
    const fragmentState: GPUFragmentState = {
      module: shaderModule,
      entryPoint: 'fs_main',
      targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }],
    }
    const pipeline = this.device.createRenderPipeline({
      vertex: vertexState,
      fragment: fragmentState,
      primitive: { topology: 'triangle-list' },
      layout: 'auto',
    })

    renderPass.setPipeline(pipeline)
    renderPass.setVertexBuffer(0, this.buffer)
    renderPass.draw(6, 1, 0, 0)
  }
}
