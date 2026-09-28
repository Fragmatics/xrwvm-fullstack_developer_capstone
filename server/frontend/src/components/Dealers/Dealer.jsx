import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import positive_icon from "../assets/positive.png"
import neutral_icon from "../assets/neutral.png"
import negative_icon from "../assets/negative.png"
import Header from '../Header/Header';

const senti_styles = {
  positive: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  neutral: "bg-amber-50 text-amber-700 ring-amber-600/20",
  negative: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const Dealer = () => {


  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(<></>)

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0,curr_url.indexOf("dealer"));
  let params = useParams();
  let id =params.id;
  let dealer_url = root_url+`djangoapp/dealer/${id}`;
  let reviews_url = root_url+`djangoapp/reviews/dealer/${id}`;
  let post_review = root_url+`postreview/${id}`;

  const get_dealer = async ()=>{
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();

    if(retobj.status === 200) {
      let dealerobjs = Array.from(retobj.dealer)
      setDealer(dealerobjs[0])
    }
  }

  const get_reviews = async ()=>{
    const res = await fetch(reviews_url, {
      method: "GET"
    });
    const retobj = await res.json();

    if(retobj.status === 200) {
      if(retobj.reviews.length > 0){
        setReviews(retobj.reviews)
      } else {
        setUnreviewed(true);
      }
    }
  }

  const senti_icon = (sentiment)=>{
    let icon = sentiment === "positive"?positive_icon:sentiment==="negative"?negative_icon:neutral_icon;
    return icon;
  }

  const senti_key = (sentiment) => senti_styles[sentiment] ? sentiment : "neutral";

  useEffect(() => {
    get_dealer();
    get_reviews();
    if(sessionStorage.getItem("username")) {
      setPostReview(
        <a href={post_review} className="btn-primary">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          Write a review
        </a>
      )
    }
  },[]);

  const counts = reviews.reduce((acc, r) => {
    acc[senti_key(r.sentiment)] += 1;
    return acc;
  }, { positive: 0, neutral: 0, negative: 0 });

return(
  <div className="min-h-screen">
    <Header/>

    <section className="relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(51,116,252,0.35),_transparent_60%)]"></div>
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <a href="/dealers" className="inline-flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-white">
          <span aria-hidden="true">&larr;</span> All dealerships
        </a>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            {dealer.full_name ? (
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{dealer.full_name}</h1>
            ) : (
              <div className="h-9 w-72 animate-pulse rounded-lg bg-white/10"></div>
            )}
            <p className="mt-3 flex items-center gap-2 text-slate-300">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-brand-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>
              {dealer['address'] && <span>{dealer['address']}, {dealer['city']}, {dealer['state']} {dealer['zip']}</span>}
            </p>
          </div>
          {postReview}
        </div>
      </div>
    </section>

    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-slate-900">
          Customer reviews {reviews.length > 0 && <span className="font-medium text-slate-400">({reviews.length})</span>}
        </h2>
        {reviews.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.keys(counts).map(k => (
              <span key={k} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${senti_styles[k]}`}>
                {counts[k]} {k}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
      {reviews.length === 0 && unreviewed === false ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="surface h-44 animate-pulse p-6"><div className="h-4 w-2/3 rounded bg-slate-100"></div></div>
          ))}
        </div>
      ):  unreviewed === true? (
        <div className="surface flex flex-col items-center px-6 py-16 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h3 className="mt-4 font-semibold text-slate-900">No reviews yet!</h3>
          <p className="mt-1 text-sm text-slate-500">Be the first to share your experience with this dealership.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map(review => (
            <article key={review.id} className="surface flex flex-col p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 rounded-full py-1 pl-1 pr-3 text-xs font-semibold capitalize ring-1 ring-inset ${senti_styles[senti_key(review.sentiment)]}`}>
                  <img src={senti_icon(review.sentiment)} className="h-5 w-5 rounded-full" alt='Sentiment'/>
                  {senti_key(review.sentiment)}
                </span>
                {review.purchase_date && <span className="text-xs text-slate-400">{review.purchase_date}</span>}
              </div>
              <p className="mt-4 flex-1 leading-relaxed text-slate-700">&ldquo;{review.review}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-sm font-semibold uppercase text-slate-600">
                  {review.name ? review.name.charAt(0) : "?"}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{review.name}</p>
                  <p className="truncate text-xs text-slate-500">{review.car_make} {review.car_model} &middot; {review.car_year}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      </div>
    </main>
  </div>
)
}

export default Dealer
