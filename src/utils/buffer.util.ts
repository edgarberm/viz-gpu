export default class BufferUtil {
  /* prettier-ignore */
  public static ShapesVertex = {
    Rect: {
      vertices: 4,
      vertex: new Float32Array([
         -0.2, -0.2,
          0.2, -0.2,
          0.2,  0.2,
         -0.2, -0.2,
          0.2,  0.2,
         -0.2,  0.2,
       ])
    }
  }

  public static createShapeVertexBuffer({
    device,
    data,
    label = '',
  }: {
    device: GPUDevice
    data: Float32Array
    label?: string
  }): GPUBuffer {
    const buffer = device.createBuffer({
      label,
      size: data.byteLength,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true,
    })

    new Float32Array(buffer.getMappedRange()).set(data)
    // unmap it so that it can be accessed from the GPU
    buffer.unmap()

    return buffer
  }
  public static getShapeVertexColors({
    vertices,
    color,
  }: {
    vertices: number
    color: [number, number, number]
  }): Float32Array {
    const colors = Array(vertices).fill(color).flat()
    return new Float32Array(colors)
  }

  public static createIndexBuffer(
    device: GPUDevice,
    data: Uint16Array
  ): GPUBuffer {
    const buffer = device.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    })

    new Uint16Array(buffer.getMappedRange()).set(data)
    buffer.unmap()

    return buffer
  }

  public static createVertexBuffer(
    device: GPUDevice,
    data: Float32Array
  ): GPUBuffer {
    const buffer = device.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    })

    new Float32Array(buffer.getMappedRange()).set(data)
    buffer.unmap()

    return buffer
  }

  public static createUniformBuffer(
    device: GPUDevice,
    data: Float32Array
  ): GPUBuffer {
    const buffer = device.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })

    return buffer
  }
}
