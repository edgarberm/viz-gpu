import Renderer from './Renderer'


const renderer = new Renderer()
renderer.initialize().then(() => {
  console.log('Initialized!')
  renderer.draw()

  const colorRed = document.querySelector('#colorRed') as HTMLInputElement
  const colorGreen = document.querySelector('#colorGreen') as HTMLInputElement
  const colorBlue = document.querySelector('#colorBlue') as HTMLInputElement
  colorRed.onchange = () => {

  }
  colorGreen.onchange = () => {

  }
  colorBlue.onchange = () => {

  }
})
