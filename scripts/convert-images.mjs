import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

async function convertImages() {
  console.log('Converting SVG images to PNG...')

  // Convert icon.svg (1024x1024) to icon.png (200x200)
  const iconSvg = readFileSync(join(publicDir, 'icon.svg'))
  await sharp(iconSvg)
    .resize(200, 200)
    .png()
    .toFile(join(publicDir, 'icon.png'))
  console.log('✓ icon.png (200x200)')

  // Convert splash.svg (200x200) to splash.png (200x200)
  const splashSvg = readFileSync(join(publicDir, 'splash.svg'))
  await sharp(splashSvg)
    .resize(200, 200)
    .png()
    .toFile(join(publicDir, 'splash.png'))
  console.log('✓ splash.png (200x200)')

  // Create og-image.png (1200x630) from icon.svg with extended background
  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 10, g: 10, b: 26, alpha: 1 } // #0a0a1a
    }
  })
    .composite([
      {
        input: await sharp(iconSvg).resize(400, 400).png().toBuffer(),
        left: 400,
        top: 115
      }
    ])
    .png()
    .toFile(join(publicDir, 'og-image.png'))
  console.log('✓ og-image.png (1200x630)')

  console.log('\nAll images converted successfully!')
}

convertImages().catch(console.error)
