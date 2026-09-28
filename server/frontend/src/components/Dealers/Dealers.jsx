import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import StateFilter from './StateFilter';

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [loading, setLoading] = useState(true);
  // let [state, setState] = useState("")
  let [states, setStates] = useState([])

  // let root_url = window.location.origin
  let dealer_url ="/djangoapp/get_dealers";

  let dealer_url_by_state = "/djangoapp/get_dealers/";

  const filterDealers = async (state) => {
    dealer_url_by_state = dealer_url_by_state+state;
    const res = await fetch(dealer_url_by_state, {
      method: "GET"
    });
    const retobj = await res.json();
    if(retobj.status === 200) {
      let state_dealers = Array.from(retobj.dealers)
      setDealersList(state_dealers)
    }
  }

  const get_dealers = async ()=>{
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();
    if(retobj.status === 200) {
      let all_dealers = Array.from(retobj.dealers)
      let states = [];
      all_dealers.forEach((dealer)=>{
        states.push(dealer.state)
      });

      setStates(Array.from(new Set(states)).sort())
      setDealersList(all_dealers)
    }
    setLoading(false);
  }
  useEffect(() => {
    get_dealers();
  },[]);


let isLoggedIn = sessionStorage.getItem("username") != null ? true : false;
return(
  <div className="min-h-screen">
    <Header/>

    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="eyebrow">Directory</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Find a dealership</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Browse trusted dealers across the country, read what real customers say, and share your own experience.
        </p>
      </div>
    </section>

    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="surface">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{dealersList.length}</span> dealerships
          </p>
          <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <span>Filter by state</span>
            <StateFilter states={states} onSelect={filterDealers}/>
          </div>
        </div>

        <div className="overflow-x-auto rounded-b-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Dealer Name</th>
                <th className="px-5 py-3">City</th>
                <th className="px-5 py-3">Address</th>
                <th className="px-5 py-3">Zip</th>
                <th className="px-5 py-3">State</th>
                {isLoggedIn ? (
                  <th className="px-5 py-3 text-right">Review Dealer</th>
                 ):<></>
                }
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={isLoggedIn ? 7 : 6} className="px-5 py-4">
                      <div className="h-4 w-full animate-pulse rounded bg-slate-100"></div>
                    </td>
                  </tr>
                ))
              ) : dealersList.map(dealer => (
                <tr key={dealer['id']} className="transition hover:bg-brand-50/40">
                  <td className="px-5 py-4 font-mono text-xs text-slate-400">{dealer['id']}</td>
                  <td className="px-5 py-4">
                    <a href={'/dealer/'+dealer['id']} className="font-semibold text-slate-900 hover:text-brand-600">{dealer['full_name']}</a>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{dealer['city']}</td>
                  <td className="px-5 py-4 text-slate-600">{dealer['address']}</td>
                  <td className="px-5 py-4 text-slate-600">{dealer['zip']}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{dealer['state']}</span>
                  </td>
                  {isLoggedIn ? (
                    <td className="px-5 py-4 text-right">
                      <a href={`/postreview/${dealer['id']}`} className="btn-secondary px-3 py-1.5 text-xs">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                        Review
                      </a>
                    </td>
                   ):<></>
                  }
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
)
}

export default Dealers
