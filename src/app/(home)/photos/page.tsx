import PhotoAlbum, { RenderPhotoProps } from 'react-photo-album';
import { getGalleryImages } from 'server/gallery';
import { getSettings } from 'server/settings';

const Photos = async () => {
  const settings = await getSettings();
  const images = await getGalleryImages(settings?.season ?? 'All');

  return (
    <>
      <PhotoAlbum
        layout="rows"
        photos={[
          ...images.map((i) => ({ src: process.env.NEXT_PUBLIC_UPLOADS_URL + i.image, width: 100, height: 50 })),
          ...images.map((i) => ({ src: process.env.NEXT_PUBLIC_UPLOADS_URL + i.image, width: 200, height: 100 })),
          ...images.map((i) => ({ src: process.env.NEXT_PUBLIC_UPLOADS_URL + i.image, width: 500, height: 250 })),
          ...images.map((i) => ({ src: process.env.NEXT_PUBLIC_UPLOADS_URL + i.image, width: 400, height: 200 })),
          ...images.map((i) => ({ src: process.env.NEXT_PUBLIC_UPLOADS_URL + i.image, width: 600, height: 450 })),
          ...images.map((i) => ({ src: process.env.NEXT_PUBLIC_UPLOADS_URL + i.image, width: 1000, height: 500 })),
          ...images.map((i) => ({ src: process.env.NEXT_PUBLIC_UPLOADS_URL + i.image, width: 300, height: 150 })),
          ...images.map((i) => ({ src: process.env.NEXT_PUBLIC_UPLOADS_URL + i.image, width: 700, height: 400 })),
          ...images.map((i) => ({ src: process.env.NEXT_PUBLIC_UPLOADS_URL + i.image, width: 100, height: 50 })),
        ]}
        defaultContainerWidth={1200}
        sizes={{ size: 'calc(100vw - 240px)' }}
      />
    </>
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
