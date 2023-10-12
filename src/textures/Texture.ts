export default class Texture {
  // public texture!: GPUTexture
  // public sampler!: GPUSampler

  constructor(public texture: GPUTexture, public sampler: GPUSampler) {}

  public static createtexture(
    device: GPUDevice,
    width: number,
    height: number
  ): Texture {
    const texture = device.createTexture({
      size: { width, height },
      format: 'rgba8unorm',
      usage: GPUTextureUsage.COPY_DST,
    })
    const sampler = device.createSampler()

    return new Texture(texture, sampler)
  }

  public static async createImageTexture(
    device: GPUDevice,
    image: HTMLImageElement
  ): Promise<Texture> {
    const texture = device.createTexture({
      size: {
        width: image.width,
        height: image.height,
      },
      format: 'rgba8unorm',
      usage:
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.RENDER_ATTACHMENT,
    })
    const data = await createImageBitmap(image)

    device.queue.copyExternalImageToTexture(
      { source: data },
      { texture: texture },
      { width: image.width, height: image.height }
    )

    const sampler = device.createSampler({
      magFilter: 'linear',
      minFilter: 'linear',
    })

    return new Texture(texture, sampler)
  }

  public static async createTextureFromURL(
    device: GPUDevice,
    url: string
  ): Promise<Texture> {
    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.src = url
      img.onload = () => resolve(img)
      img.onerror = (error) => reject(error)
    })

    const image = await promise

    return Texture.createImageTexture(device, image)
  }
}
