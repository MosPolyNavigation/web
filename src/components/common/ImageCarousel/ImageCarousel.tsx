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
  
    const isSingle = images.length === 1
  
    return (
      <div className={cl.imageCarousel}>
        <div
          className={`${cl.carouselContainer} ${isSingle ? cl.single : ''}`}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={`${cl.carouselImage} ${isSingle ? cl.singleImage : ''}`}
            >
              <img src={image} alt={`${alt} - Image ${index + 1}`} draggable={false} />
            </div>
          ))}
        </div>
      </div>
    )
  }
  

export default ImageCarousel

