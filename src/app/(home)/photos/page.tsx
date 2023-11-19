import Image from 'next/image';
import { getGalleryImages } from 'server/gallery';
import { getSettings } from 'server/settings';

const Photos = async () => {
  const settings = await getSettings();
  const images = await getGalleryImages(settings?.global.season ?? 'All');

  return (
    <div className="grid auto-rows-fr gap-2 sm:grid-cols-1 lg:grid-cols-4">
      {images.map((image) => (
        <div key={image.id}>
          <Image
            src={process.env.NEXT_PUBLIC_UPLOADS_URL + image.image}
            alt="test"
            width={1000}
            height={1000}
            priority
          />
        </div>
      ))}
    </div>
  );
};

export default Photos;
