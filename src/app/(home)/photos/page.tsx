import Image from 'next/image';
import PhotoAlbum, { RenderPhotoProps } from 'react-photo-album';
import { getGalleryImages } from 'server/gallery';

const Photos = async () => {
  const images = await getGalleryImages();

  return (
    <PhotoAlbum
      layout="rows"
      photos={[
        ...images.map((i) => ({ src: process.env.UPLOADS_URL + i.image, width: 1000, height: 1000 })),
        ...images.map((i) => ({ src: process.env.UPLOADS_URL + i.image, width: 1000, height: 1000 })),
        ...images.map((i) => ({ src: process.env.UPLOADS_URL + i.image, width: 1000, height: 1000 })),
        ...images.map((i) => ({ src: process.env.UPLOADS_URL + i.image, width: 1000, height: 1000 })),
      ]}
      defaultContainerWidth={1200}
      sizes={{ size: 'calc(100vw - 240px)' }}
    />
  );

  // return (
  //   <div className="flex flex-wrap gap-2">
  //     <div className="flex-[32.9%] max-w-[32.9%]">
  //       {images.map((image) => (
  //         <div key={image.id} className="w-full mb-2">
  //           <Image src={process.env.UPLOADS_URL + image.image} alt="test" width={1000} height={1000} />
  //         </div>
  //       ))}
  //     </div>
  //     <div className="flex-[32.9%] max-w-[32.9%]">
  //       {images.map((image) => (
  //         <div key={image.id} className="w-full mb-2">
  //           <Image src={process.env.UPLOADS_URL + image.image} alt="test" width={1000} height={1000} />
  //         </div>
  //       ))}
  //     </div>
  //     <div className="flex-[32.9%] max-w-[32.9%]">
  //       {[...images].reverse().map((image) => (
  //         <div key={image.id} className="w-full mb-2">
  //           <Image src={process.env.UPLOADS_URL + image.image} alt="test" width={1000} height={1000} />
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
};

export default Photos;
