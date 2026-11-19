import React, { useEffect, useState } from 'react';
import { ChevronDown, ExternalLink, MapPin, Quote, Star, Store } from 'lucide-react';
import { business, justdialListing, mapsListing } from './business';
import Reveal from './Reveal';
import testimonials from './testimonials';

const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();
let mapsReady;
const googleSnapshot = { rating: 5.0, count: 248 };
const justdialSnapshot = { rating: 4.9, count: 578 };
const countFormat = new Intl.NumberFormat('en-IN');

function ListingRating({ name, icon: Icon, rating, count, countLabel, href, live = false, delay = 0 }) {
  return <Reveal as="article" className="listing-rating" delay={delay}>
    <div className="listing-head">
      <div className="listing-provider">
        <span className="listing-icon"><Icon size={20} aria-hidden="true" /></span>
        <h3 translate="no">{name}</h3>
      </div>
      <span className="listing-status">{live ? 'Live rating' : 'Listing snapshot'}</span>
    </div>
    <div className="listing-body">
      <div className="listing-score">
        <strong>{rating.toFixed(1)}</strong> <span>/ 5</span>
      </div>
      <div className="listing-detail">
        <div className="listing-stars" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => (
            <span className="rating-star" key={index}>
              <Star size={16} />
              <span style={{ width: `${Math.max(0, Math.min(1, rating - index)) * 100}%` }}><Star size={16} fill="currentColor" /></span>
            </span>
          ))}
        </div>
        {typeof count === 'number' && <span>{countFormat.format(count)} {countLabel}</span>}
      </div>
      <a className="listing-link" href={href} target="_blank" rel="noreferrer">View on {name} <ExternalLink size={15} aria-hidden="true" /></a>
    </div>
  </Reveal>;
}

function FeaturedReviews() {
  const [expanded, setExpanded] = useState(false);
  const visibleReviews = expanded ? testimonials : testimonials.slice(0, 3);

  return <>
    <div className="review-grid" id="featured-reviews">
      {visibleReviews.map(({ author, quote }, index) => (
        <Reveal as="figure" className="review-card testimonial" key={author} delay={index % 3 * 65}>
          <Quote className="quote-icon" size={26} aria-hidden="true" />
          <blockquote>{quote}</blockquote>
          <figcaption><span className="review-initials" aria-hidden="true">{author.split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase()}</span>{author}</figcaption>
        </Reveal>
      ))}
    </div>
    <Reveal className="review-actions">
      <button className="button secondary review-toggle" onClick={() => setExpanded(!expanded)} aria-controls="featured-reviews" aria-expanded={expanded}>
        {expanded ? 'Show fewer reviews' : 'Show more reviews'} <ChevronDown size={17} aria-hidden="true" />
      </button>
    </Reveal>
  </>;
}

function loadMaps() {
  if (window.google?.maps?.importLibrary) return Promise.resolve(window.google.maps);
  if (!mapsReady) {
    mapsReady = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async&callback=vishwaMapsReady&auth_referrer_policy=origin`;
      script.async = true;
      const timeout = window.setTimeout(fail, 12000);
      function fail() {
        window.clearTimeout(timeout);
        reject(new Error('Google Maps did not load.'));
      }
      window.gm_authFailure = fail;
      window.vishwaMapsReady = () => {
        window.clearTimeout(timeout);
        resolve(window.google.maps);
      };
      script.onerror = fail;
      document.head.append(script);
    });
  }
  return mapsReady;
}

export default function Reviews() {
  const configured = Boolean(apiKey && business.placeId);
  const [place, setPlace] = useState(null);
  useEffect(() => {
    if (!configured) return;
    let active = true;
    async function getReviews() {
      try {
        const maps = await loadMaps();
        const { Place } = await maps.importLibrary('places');
        const place = new Place({ id: business.placeId });
        await place.fetchFields({ fields: ['rating', 'userRatingCount', 'reviews', 'googleMapsURI'] });
        if (active) setPlace(place);
      } catch {
        // The listing snapshot and selected reviews are already displayed.
      }
    }
    getReviews();
    return () => { active = false; };
  }, [configured]);

  const liveRating = typeof place?.rating === 'number';
  const liveReviews = Boolean(place?.reviews?.length);
  return (
    <section className="section reviews" id="reviews">
      <div className="wrap">
        <Reveal className="section-head">
          <div><p className="eyebrow">RATINGS & REVIEWS</p><h2>What customers say</h2></div>
        </Reveal>
        <div className="listing-grid" aria-label="Ratings by platform">
          <ListingRating name="Google Maps" icon={MapPin} rating={liveRating ? place.rating : googleSnapshot.rating}
            count={liveRating ? place.userRatingCount : googleSnapshot.count}
            countLabel="reviews" href={place?.googleMapsURI || mapsListing} live={liveRating} />
          <ListingRating name="Justdial" icon={Store} {...justdialSnapshot} countLabel="ratings" href={justdialListing} delay={80} />
        </div>
        <Reveal><h3 className="review-group-title">{liveReviews ? 'Latest from Google Maps' : 'Selected customer reviews'}</h3></Reveal>
        {liveReviews ? <div className="review-panel" aria-label="Live reviews from Google Maps">
            <div className="review-grid">{place.reviews.map((review, index) => {
              const author = review.authorAttribution;
              return <Reveal as="article" key={review.googleMapsURI || index} className="review-card" delay={index % 3 * 65}>
                <div className="review-author">
                  {author?.photoURI && <img src={author.photoURI} alt="" loading="lazy" referrerPolicy="no-referrer" />}
                  {author?.uri ? <a href={author.uri} rel="noreferrer" target="_blank">{author.displayName}</a> : <strong>{author?.displayName || 'Google reviewer'}</strong>}
                </div>
                <p className="review-meta">{review.rating} / 5 {review.relativePublishTimeDescription && `· ${review.relativePublishTimeDescription}`}</p>
                {(review.text || review.originalText) && <p>{review.text || review.originalText}</p>}
                {review.googleMapsURI && <a href={review.googleMapsURI} target="_blank" rel="noreferrer">View review on Google Maps</a>}
              </Reveal>;
            })}</div>
          </div> : <FeaturedReviews />}
        {place?.attributions?.map((item, index) => <p className="review-meta review-attribution" key={index}>{typeof item === 'string' ? item : item.providerURI ? <a href={item.providerURI} target="_blank" rel="noreferrer">{item.provider}</a> : item.provider}</p>)}
      </div>
    </section>
  );
}
