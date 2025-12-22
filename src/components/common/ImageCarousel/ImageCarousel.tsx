import { FC } from 'react'
import cl from './ImageCarousel.module.scss'

interface ImageCarouselProps {
  images: string[]
  alt?: string
}

const ImageCarousel: FC<ImageCarouselProps> = ({ images, alt = 'Image' }) => {
  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className={cl.imageCarousel}>
      <div className={cl.carouselContainer}>
        {images.map((image, index) => (
          <div key={index} className={cl.carouselImage}>
            <img src={image} alt={`${alt} - Image ${index + 1}`} draggable={false} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageCarousel

