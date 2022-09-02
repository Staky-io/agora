<template>
  <div ref="jazzicon" />
</template>

<script setup lang="ts">
import MersenneTwister from 'mersenne-twister'
import Color from 'color'
import { parseAddressToNumber } from '@/assets/scripts/helpers'

type HexColor = `#${string}`
type HexColors = HexColor[]

type Props = {
  seed?: number
  diameter?: number
  address?: string
  shapeCount?: number
  colors?: HexColors
}

const props = withDefaults(defineProps<Props>(), {
  seed: Math.round(Math.random() * 10000000),
  diameter: 100,
  address: '',
  shapeCount: 4,
  colors: () => [
    '#01888C', // teal
    '#FC7500', // bright orange
    '#034F5D', // dark teal
    '#F73F01', // orangered
    '#FC1960', // magenta
    '#C7144C', // raspberry
    '#F3C100', // goldenrod
    '#1598F2', // lightning blue
    '#2465E1', // sail blue
    '#F19E02', // gold
  ],
})

const svgns = 'http://www.w3.org/2000/svg'

const jazzicon = ref<HTMLDivElement | null>(null)
const generator = ref<MersenneTwister>(null)

const shiftHue = (colors: HexColors): HexColors => {
  const wobble = 30
  const amount = generator.value.random() * 30 - wobble / 2
  return colors.map((hex) => {
    const color = Color(hex)
    color.rotate(amount)
    return color.hex() as HexColor
  })
}

const createNewPaper = (diameter: number, color: HexColor): HTMLDivElement => {
  const container = document.createElement('div')
  container.style.borderRadius = `${diameter / 2}px`
  container.style.overflow = 'hidden'
  container.style.padding = '0px'
  container.style.margin = '0px'
  container.style.width = `${diameter}px`
  container.style.height = `${diameter}px`
  container.style.display = 'inline-block'
  container.style.background = color
  return container
}

const generateColor = (colors: HexColors): HexColor => {
  generator.value.random()
  const idx = Math.floor(colors.length * generator.value.random())
  const color = colors.splice(idx, 1)[0]
  return color
}

const genShape = (remainingColors: HexColors, diameter: number, index: number, total: number, svg: SVGElement): void => {
  const center = diameter / 2
  const shape = document.createElementNS(svgns, 'rect')
  shape.setAttributeNS(null, 'x', '0')
  shape.setAttributeNS(null, 'y', '0')
  shape.setAttributeNS(null, 'width', diameter.toString())
  shape.setAttributeNS(null, 'height', diameter.toString())
  const firstRot = generator.value.random()
  const angle = Math.PI * 2 * firstRot
  const velocity = (diameter / total) * generator.value.random() + (index * diameter) / total
  const tx = Math.cos(angle) * velocity
  const ty = Math.sin(angle) * velocity
  const translate = `translate(${tx} ${ty})`
  const secondRot = generator.value.random()
  const rot = firstRot * 360 + secondRot * 180
  const rotate = `rotate(${rot.toFixed(1)} ${center} ${center})`
  const transform = `${translate} ${rotate}`
  shape.setAttributeNS(null, 'transform', transform)
  const fill = generateColor(remainingColors)
  shape.setAttributeNS(null, 'fill', fill)
  svg.appendChild(shape)
}

const generateIdenticon = (diameter: number, seed: number): HTMLDivElement => {
  generator.value = new MersenneTwister(seed)
  const remainingColors = shiftHue(props.colors.slice())
  const container = createNewPaper(diameter, generateColor(remainingColors))
  const svg = document.createElementNS(svgns, 'svg')
  svg.setAttributeNS(null, 'x', '0')
  svg.setAttributeNS(null, 'y', '0')
  svg.setAttributeNS(null, 'width', diameter.toString())
  svg.setAttributeNS(null, 'height', diameter.toString())
  container.appendChild(svg)
  for (let i = 0; i < props.shapeCount - 1; i++) {
    genShape(remainingColors, diameter, i, props.shapeCount - 1, svg)
  }
  return container
}

const generateIcon = (): void => {
  const seed = props.address ? parseAddressToNumber(props.address) : props.seed
  jazzicon.value.innerHTML = ''
  const element = generateIdenticon(props.diameter, seed)
  jazzicon.value.append(element)
}

watch(() => props.address, generateIcon)
watch(() => props.diameter, generateIcon)
watch(() => props.seed, generateIcon)

onMounted(generateIcon)
</script>
