import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header/Header';


const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState();
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0,curr_url.indexOf("postreview"));
  let params = useParams();
  let id =params.id;
  let dealer_url = root_url+`djangoapp/dealer/${id}`;
  let review_url = root_url+`djangoapp/add_review`;
  let carmodels_url = root_url+`djangoapp/get_cars`;

  const postreview = async ()=>{
    let name = sessionStorage.getItem("firstname")+" "+sessionStorage.getItem("lastname");
    //If the first and second name are stores as null, use the username
    if(name.includes("null")) {
      name = sessionStorage.getItem("username");
    }
    if(!model || review === "" || date === "" || year === "" || model === "") {
      alert("All details are mandatory")
      return;
    }

    let model_split = model.split(" ");
    let make_chosen = model_split[0];
    let model_chosen = model_split[1];

    let jsoninput = JSON.stringify({
      "name": name,
      "dealership": id,
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_chosen,
      "car_model": model_chosen,
      "car_year": year,
    });

    console.log(jsoninput);
    const res = await fetch(review_url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: jsoninput,
  });

  const json = await res.json();
  if (json.status === 200) {
      window.location.href = window.location.origin+"/dealer/"+id;
  }

  }
  const get_dealer = async ()=>{
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    if(retobj.status === 200) {
      let dealerobjs = Array.from(retobj.dealer)
      if(dealerobjs.length > 0)
        setDealer(dealerobjs[0])
    }
  }

  const get_cars = async ()=>{
    const res = await fetch(carmodels_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    let carmodelsarr = Array.from(retobj.CarModels)
    setCarmodels(carmodelsarr)
  }
  useEffect(() => {
    get_dealer();
    get_cars();
  },[]);


  return (
    <div className="min-h-screen">
      <Header/>
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <a href={"/dealer/"+id} className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-600">
          <span aria-hidden="true">&larr;</span> Back to dealer
        </a>

        <div className="surface mt-4 overflow-hidden">
          <div className="border-b border-slate-200 bg-gradient-to-br from-brand-50 to-white px-6 py-6 sm:px-8">
            <p className="eyebrow">Write a review</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{dealer.full_name || "Loading dealer..."}</h1>
            {dealer.city && <p className="mt-1 text-sm text-slate-500">{dealer.city}, {dealer.state}</p>}
          </div>

          <div className="space-y-5 px-6 py-6 sm:px-8">
            <div>
              <label htmlFor="review" className="form-label">Your experience</label>
              <textarea id='review' rows='6' className="form-input resize-y" placeholder="What did you like or dislike about this dealership?" onChange={(e) => setReview(e.target.value)}></textarea>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="purchase_date" className="form-label">Purchase Date</label>
                <input id="purchase_date" type="date" className="form-input" onChange={(e) => setDate(e.target.value)}/>
              </div>
              <div>
                <label htmlFor="car_year" className="form-label">Car Year</label>
                <input id="car_year" type="number" className="form-input" placeholder="e.g. 2021" onChange={(e) => setYear(e.target.value)} max={2023} min={2015}/>
              </div>
            </div>

            <div>
              <label htmlFor="cars" className="form-label">Car Make and Model</label>
              <select name="cars" id="cars" className="form-input" defaultValue="" onChange={(e) => setModel(e.target.value)}>
              <option value="" disabled hidden>Choose Car Make and Model</option>
              {carmodels.map(carmodel => (
                  <option key={carmodel.CarMake+" "+carmodel.CarModel} value={carmodel.CarMake+" "+carmodel.CarModel}>{carmodel.CarMake} {carmodel.CarModel}</option>
              ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
            <a href={"/dealer/"+id} className="btn-secondary">Cancel</a>
            <button className='btn-primary' onClick={postreview}>Post Review</button>
          </div>
        </div>
      </main>
    </div>
  )
}
export default PostReview
