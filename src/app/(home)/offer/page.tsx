import { sanitize } from 'isomorphic-dompurify';
import { redirect } from 'next/navigation';
import { getOfferDocument } from 'server/documents';

const Offer = async () => {
  const document = await getOfferDocument();

  if (!document) redirect('/');

  return (
    <main className="layout-container pt-10" dangerouslySetInnerHTML={{ __html: sanitize(document.publicOffer) }} />
  );
};

export default Offer;
