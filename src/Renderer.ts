import shader from './shaders/shape.wgsl?raw'
import Rectangle from './shapes/Rectangle'

export default class Renderer {
  private canvas!: HTMLCanvasElement
  private context!: GPUCanvasContext
  private device!: GPUDevice
  private renderPass!: GPURenderPassEncoder

  public color: RGBColor = [0.0, 1.0, 0.7]

  constructor() {}

  public async initialize(): Promise<void> {
    const adapter = await navigator.gpu.requestAdapter()
    this.device = (await adapter?.requestDevice()) as GPUDevice

    this.canvas = document.getElementById('canvas') as HTMLCanvasElement
    this.context = this.canvas.getContext('webgpu') as GPUCanvasContext
    this.context.configure({
      device: this.device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      alphaMode: 'premultiplied',
    })
  }

  public draw(): void {
    const rectangleMesh = new Rectangle(
      this.device,
      { x: 0.0, y: 0 },
      { width: 0.5, height: 0.5 },
      this.color,
    )

    const commandEncoder: GPUCommandEncoder = this.device.createCommandEncoder()
    const textureView = this.context.getCurrentTexture().createView()
    this.renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: textureView,
          clearValue: { r: 1.0, g: 1.0, b: 1.0, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    })

    rectangleMesh.render(shader, this.renderPass)
    this.renderPass.end()

    this.device.queue.submit([commandEncoder.finish()])
  }

  public updateColor(color: RGBColor) {
    this.color = color
  }
}
