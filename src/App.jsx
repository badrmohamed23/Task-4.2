import React, { useEffect, useMemo, useState } from 'react';

const KEY = 'acl-marketplace-v3';
const categories = ['all', 'textbooks', 'electronics', 'furniture', 'clothing', 'other'];
const conditions = ['new', 'like-new', 'used', 'worn'];
const currentUser = {name: 'You', email: 'you@example.com'}; // Demo account; no login backend
const USERKEY = 'acl-marketplace-user-v1';
function savedUser(){try{const v=JSON.parse(localStorage.getItem(USERKEY));if(v&&v.signedOut)return null;if(v&&v.name&&v.email)return v;}catch{}return currentUser;}
function fileToImage(file){return new Promise(res=>{const url=URL.createObjectURL(file);const img=new Image();img.onload=()=>{const max=800;const scale=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);res(c.toDataURL('image/jpeg',0.72));};img.onerror=()=>{URL.revokeObjectURL(url);res(null);};img.src=url;});}
const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=82`;
const seed = [
  {id:'m1', title:'Calculus II textbook', category:'textbooks', condition:'used', price:320, description:'Second-year calculus textbook, complete with all chapters. A few highlighted sections and notes in pencil, but no missing or torn pages. Useful for the midterm and final revision sessions. You can inspect it before deciding.', status:'active', owner:'you', seller:'You', sellerEmail:currentUser.email, pickup:'GUC student area, near the main cafeteria', photos:[photo('photo-1544947950-fa07a98d237f'),photo('photo-1494438639946-1ebd1d20bf85')], emoji:'📚'},
  {id:'m2', title:'Student desk lamp', category:'furniture', condition:'like-new', price:240, description:'Compact study lamp with warm light, adjustable position and a USB power cable. Used for one semester only. The cable and light both work. Great for a dorm desk or a small workspace.', status:'active', owner:'other', seller:'Mariam', sellerEmail:'mariam.seller@example.com', pickup:'GUC library entrance, weekdays after 1 PM', photos:[photo('photo-1555475384-a0aefc775412')], emoji:'💡'},
  {id:'m3', title:'Bluetooth headphones', category:'electronics', condition:'used', price:650, description:'Wireless over-ear headphones in good working condition. They connect with Bluetooth and include the original carrying pouch and charging cable. The battery lasts about six hours based on my usage. There are a few cosmetic scratches near one hinge; see the photos. Happy to let you test sound and pairing before buying.', status:'active', owner:'other', seller:'Omar', sellerEmail:'omar.seller@example.com', pickup:'Arrange a meetup at GUC Gate 3', photos:[photo('photo-1599955051125-571f47e04316'),photo('photo-1505740420928-5e560c06d30e'),photo('photo-1546435770-a3e426bf472b')], emoji:'🎧'},
  {id:'m4', title:'Engineering lab coat', category:'clothing', condition:'new', price:200, description:'White engineering lab coat, medium size, bought for a lab but never worn. Still clean and folded. Suitable for laboratory practical sessions. Please check your required size before arranging pickup.', status:'active', owner:'you', seller:'You', sellerEmail:currentUser.email, pickup:'Meet at GUC main entrance, mornings', photos:[photo('photo-1542058186993-286fdce0b580')], emoji:'🥼'},
  {id:'m5', title:'Drawing tablet', category:'electronics', condition:'like-new', price:1450, description:'Small USB drawing tablet with pressure-sensitive pen and protective sleeve. Used for a few class illustrations; fully functional. Works with common creative software after installing the manufacturer driver. You are welcome to try the pen and pressure sensitivity on my laptop before buying.', status:'active', owner:'other', seller:'Nour', sellerEmail:'nour.seller@example.com', pickup:'GUC design building reception', photos:[photo('photo-1671087709820-274fdd9ac67a')], emoji:'✏️'},
  {id:'m6', title:'Used storage shelf', category:'furniture', condition:'worn', price:390, description:'Light wooden storage shelf. Stable and usable, though there are visible scratches from moving rooms. The shelves are best for books, stationery and small storage boxes, not very heavy appliances. Buyer should arrange a way to transport it from near campus.', status:'active', owner:'other', seller:'Youssef', sellerEmail:'youssef.seller@example.com', pickup:'Collect from a public pickup point near GUC, by arrangement', photos:[photo('photo-1692195321701-1a454c79ab02'),photo('photo-1758279746549-d24f3784879d')], emoji:'🗄️'},
  {id:'m7', title:'MATH 201 workbook', category:'textbooks', condition:'used', price:140, description:'Workbook with practice problems, solutions and lecture notes. All pages present and in readable condition. Some exercises have answers written in pencil. Already sold to another student.', status:'sold', owner:'you', seller:'You', sellerEmail:currentUser.email, pickup:'GUC campus (previous listing)', photos:[photo('photo-1544947950-fa07a98d237f')], emoji:'📖'},
  {id:'m8', title:'Sketching kit', category:'other', condition:'like-new', price:180, description:'Charcoal pencils, graphite pencils, blending tools and an A5 sketch pad. Some pencils have been lightly used, but the set still has plenty of material for design practice and drawing assignments.', status:'active', owner:'other', seller:'Salma', sellerEmail:'salma.seller@example.com', pickup:'Meet outside the GUC architecture studios', photos:[photo('photo-1758521232691-613561977b6a'),photo('photo-1771366629879-8b3128ee62ca')], emoji:'🎨'},
];
const emptyForm = {title:'', price:'', category:'', condition:'', description:'', pickup:'', status:'active', images:[]};
function saved(){try {const value=JSON.parse(localStorage.getItem(KEY));return Array.isArray(value)?value:seed;}catch{return seed;}}
const cap = s => s==='like-new'?'Like new':(s||'').replace(/\b\w/g,m=>m.toUpperCase());
function fieldErrors(form){
 const e={};
 if(!form.title.trim())e.title='Please complete the item title.';
 if(form.price.trim()===''||!Number.isFinite(Number(form.price))||Number(form.price)<0)e.price='Enter a price of zero or more.';
 if(!categories.slice(1).includes(form.category))e.category='Choose a category.';
 if(!conditions.includes(form.condition))e.condition='Choose an item condition.';
 if(!['active','sold'].includes(form.status))e.status='Choose a valid status.';
 return e;
}
function ListingImage({src, alt, emoji, className=''}) {
 const [broken, setBroken] = useState(false);
 useEffect(() => setBroken(false), [src]);
 return src && !broken
   ? <img className={className} src={src} alt={alt} loading="lazy" onError={() => setBroken(true)} />
   : <span className="item-emoji" aria-label="Photo unavailable">{emoji || '📦'}</span>;
}
export default function App(){
 const [items,setItems] = useState(saved);
 const [query,setQuery] = useState('');
 const [category,setCategory] = useState('all');
 const [sort,setSort] = useState('featured');
 const [selected,setSelected] = useState(null);
 const [editor,setEditor] = useState(null); // null or {id,form}
 const [error,setError] = useState('');
 const [activePhoto,setActivePhoto] = useState(0);
 const [notice,setNotice] = useState('');
 const [compare,setCompare] = useState([]);
 const [showCompare,setShowCompare] = useState(false);
 const [budget,setBudget] = useState('any');
 const [ferr,setFerr] = useState({});
 const [account,setAccount] = useState(savedUser);
 const [menuOpen,setMenuOpen] = useState(false);
 const [authOpen,setAuthOpen] = useState(false);
 const [authForm,setAuthForm] = useState(currentUser);
 const [authErr,setAuthErr] = useState('');
 const [imgErr,setImgErr] = useState('');
 useEffect(()=>localStorage.setItem(KEY,JSON.stringify(items)),[items]);
 useEffect(()=>{if(account)localStorage.setItem(USERKEY,JSON.stringify(account));else localStorage.setItem(USERKEY,JSON.stringify({signedOut:true}));},[account]);
 useEffect(()=>setActivePhoto(0),[selected]);
 const listing = useMemo(()=>{let a=items.filter(x=>(category==='all'||x.category===category)&&(budget==='any'||x.price<=Number(budget))&&`${x.title} ${x.category} ${x.description}`.toLowerCase().includes(query.toLowerCase()));if(sort==='low')a.sort((a,b)=>a.price-b.price);if(sort==='high')a.sort((a,b)=>b.price-a.price);return a;},[items,category,query,sort,budget]);
 const cheapestId = useMemo(()=>{const act=listing.filter(x=>x.status==='active');return act.length>1?act.reduce((m,x)=>x.price<m.price?x:m,act[0]).id:null;},[listing]);
 function toggleCompare(id){setCompare(c=>c.includes(id)?c.filter(x=>x!==id):(c.length>=3?c:[...c,id]));}
 function openSell(){if(!account){setAuthOpen(true);return;}startEdit(null);}
 function startEdit(item){if(item&&item.owner!=='you')return;setError('');setFerr({});setImgErr('');setEditor({id:item?.id||null,url:'',form:item?{title:item.title,price:String(item.price),category:item.category,condition:item.condition,description:item.description,pickup:item.pickup || '',status:item.status,images:[...(item.photos||[])]}:{...emptyForm}});}
 function addImageUrl(){const v=(editor.url||'').trim();if(!v)return;setEditor(s=>({...s,url:'',form:{...s.form,images:[...s.form.images,v].slice(0,4)}}));setImgErr('');}
 function removeImage(index){setEditor(s=>({...s,form:{...s.form,images:s.form.images.filter((_,x)=>x!==index)}}));}
 async function addPhotoFile(event){const file=event.target.files?.[0];event.target.value='';if(!file||!file.type.startsWith('image/')){setImgErr('Choose an image file.');return;}setImgErr('');const data=await fileToImage(file);if(!data){setImgErr('That image could not be read.');return;}setEditor(s=>({...s,form:{...s.form,images:[...s.form.images,data].slice(0,4)}}));}
 function submit(event){event.preventDefault();const f=editor.form;const errs=fieldErrors(f);if(Object.keys(errs).length){setFerr(errs);setError('Unable to save item. Check the highlighted fields.');return;}setFerr({});setError('');const original=editor.id?items.find(x=>x.id===editor.id):null;const next={...f, title:f.title.trim(),price:Number(f.price),description:f.description.trim(),pickup:f.pickup.trim(),photos:f.images,emoji:original?.emoji || '📦',owner:'you',seller:(account.name||'You').trim(),sellerEmail:account.email};
 if(editor.id){setItems(items.map(x=>x.id===editor.id?{...x,...next}:x));setNotice('Changes saved.');}else{setItems([{...next,id:`m-${Date.now()}`,status:'active'},...items]);setNotice('Item listed.');}setEditor(null);setSelected(null);}
 function reset(){setItems(seed);setSelected(null);setEditor(null);setQuery('');setCategory('all');setSort('featured');setBudget('any');setCompare([]);setShowCompare(false);setNotice('Example items restored.');}
 function logout(){setAccount(null);setMenuOpen(false);setEditor(null);setNotice('Signed out. Browse freely — sign in to sell or edit.');}
 function doSignIn(event){event.preventDefault();const name=authForm.name.trim(),email=authForm.email.trim();if(!name){setAuthErr('Enter your name.');return;}if(!email||!email.includes('@')){setAuthErr('Enter a valid contact email (with @).');return;}setAuthErr('');setAccount({name,email});setAuthOpen(false);setNotice(`Welcome, ${name}. You can now sell and edit listings.`);}
 return <div className="market-app">
  <div className="utility"><span>Campus Exchange</span><span>Trusted by students • All prices in EGP</span></div>
  <header className="navigation"><button className="brand" onClick={()=>{setSelected(null);setCategory('all')}}><span className="brand-icon">✳</span> CAMPUS<span className="brand-alt">exchange</span></button><nav><a href="#discover">Browse items</a><button onClick={()=>setCategory('textbooks')}>Textbooks</button><button onClick={()=>setCategory('electronics')}>Electronics</button></nav><div className="nav-actions"><button className="userbtn" aria-haspopup="menu" aria-expanded={menuOpen} aria-label={account?`Account menu — ${account.name}`:'Sign in'} onClick={()=>setMenuOpen(v=>!v)}><span className="usercircle">{account?(account.name.trim()[0]||'Y').toUpperCase():'?'}</span></button><button className="sell-cta" onClick={openSell}>+ Sell an item</button>{menuOpen&&<><div className="menu-backdrop" onClick={()=>setMenuOpen(false)}/><div className="usermenu" role="menu" aria-label="Account">{account?<><p className="menuname">{account.name}</p><p className="menuemail">{account.email}</p><button type="button" className="menuaction" role="menuitem" onClick={logout}>Log out</button></>:<button type="button" className="menuaction menuaction-in" role="menuitem" onClick={()=>{setMenuOpen(false);setAuthOpen(true);}}>Sign in</button>}</div></>}</div></header>
  <main>
   <section className="promo"><div className="promo-copy"><span className="tag">THE CAMPUS MARKETPLACE</span><h1>Everything you need,<br/><i>right around campus.</i></h1><p>Browse little finds, big essentials and almost everything in between.</p><button onClick={()=>document.getElementById('discover')?.scrollIntoView({behavior:'smooth'})}>Explore listings <span>↗</span></button></div><div className="promo-art"><span>📚</span><span>💡</span><span>🎧</span><span>🛋️</span></div></section>
   <section className="discovery" id="discover"><div className="discover-top"><div><p className="section-kicker">CURATED FOR YOUR CAMPUS</p><h2>Find something good.</h2><p>Items listed by people around you.</p></div><div className="discover-right"><label className="search"><span>⌕</span><input aria-label="Search listings" placeholder="Search listings" value={query} onChange={e=>setQuery(e.target.value)}/></label><label className="sort"><span>Max price</span><select aria-label="Maximum price" value={budget} onChange={e=>setBudget(e.target.value)}><option value="any">Any price</option><option value="150">Under EGP 150</option><option value="300">Under EGP 300</option><option value="600">Under EGP 600</option><option value="1000">Under EGP 1,000</option></select></label><label className="sort"><span>Sort</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div></div>
    <div className="category-row">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={category===c?'on':''}>{c==='all'?'All items':cap(c)}</button>)}</div>
    {notice&&<p className="notice" role="status">{notice} <button onClick={()=>setNotice('')}>×</button></p>}
    <div className="listing-grid">{listing.map(item=><article className="product" key={item.id}><button className="photo" onClick={()=>setSelected(item.id)}><span className="stamp">{cap(item.condition)}</span>{item.id===cheapestId&&item.status==='active'&&<span className="dealstamp">Lowest price</span>}<ListingImage src={item.photos?.[0]} alt={item.title} emoji={item.emoji} className="listing-img" /><span className="category-caption">{cap(item.category)}</span></button><div className="prod-details"><div className="prod-topline"><span className="muted">{item.category}</span><span className={item.status==='sold'?'soldstatus':'instock'}>{item.status.toUpperCase()}</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="costline"><strong>EGP {item.price.toLocaleString()}</strong><span>{item.condition}</span></div><div className="prod-actions"><button className="details-button" onClick={()=>setSelected(item.id)}>View item <span>↗</span></button><button className={compare.includes(item.id)?'comparebtn on':'comparebtn'} aria-pressed={compare.includes(item.id)} disabled={!compare.includes(item.id)&&compare.length>=3} aria-label={`Compare ${item.title}`} onClick={()=>toggleCompare(item.id)}>{compare.includes(item.id)?'✓ Comparing':'⇄ Compare'}</button></div></div></article>)}{listing.length===0&&<div className="noresults"><p>No listings match your search.</p><span>Filters can be too tight — or you can list something yourself.</span><button className="sell-cta" onClick={openSell}>+ Sell an item</button></div>}</div>
   </section>
   {compare.length>0&&<div className="compare-bar" role="region" aria-label="Compare tray"><div className="compare-mini">{compare.map(id=>{const it=items.find(x=>x.id===id);return it?<button key={id} type="button" className="mini-chip" onClick={()=>toggleCompare(id)} aria-label={`Remove ${it.title} from comparison`}><span aria-hidden="true">{it.emoji||'📦'}</span><span className="mini-title">{it.title}</span><span aria-hidden="true">×</span></button>:null;})}</div><div className="compare-bar-actions"><button className="sell-cta" disabled={compare.length<2} onClick={()=>setShowCompare(true)}>Compare {compare.length>1?`${compare.length} items`:compare.length+' item'}</button><button type="button" className="clearbtn" onClick={()=>setCompare([])}>Clear all</button></div></div>}
   <footer><strong>CAMPUS exchange</strong><span>From students, for students.</span><button onClick={reset}>Reset demo</button></footer>
  </main>
  {selected&&(()=>{
   const item=items.find(x=>x.id===selected);if(!item)return null;
   const images=item.photos || [];
   const subject=encodeURIComponent(`Campus Exchange: ${item.title}`);
   const body=encodeURIComponent(`Hi ${item.seller},\n\nI'm interested in your listing "${item.title}" (EGP ${item.price}). Is it still available?\n\n`);
   return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setSelected(null)}>
    <section className="detail-panel" role="dialog" aria-modal="true" aria-label="Item details">
     <button className="close" aria-label="Close item details" onClick={()=>setSelected(null)}>×</button>
     <div className="detail-visual">
      <ListingImage src={images[activePhoto] || images[0]} alt={`${item.title} photo ${activePhoto+1}`} emoji={item.emoji} className="detail-img" />
     </div>
     {images.length>1&&<div className="detail-thumbs" aria-label="Item photos">{images.map((src,index)=><button type="button" key={index} className={activePhoto===index?'thumb active':'thumb'} aria-label={`Show photo ${index+1} of ${images.length}`} aria-pressed={activePhoto===index} onClick={()=>setActivePhoto(index)}><ListingImage src={src} alt="" emoji={item.emoji} className="thumb-img" /></button>)}</div>}
     <p className="section-kicker">{cap(item.category)} · {cap(item.condition)}</p>
     <h2>{item.title}</h2>
     <h3>EGP {item.price.toLocaleString()}</h3>
     <p className="item-description">{item.description||'No description supplied.'}</p>
      <div className="detail-meta"><p><strong>Pickup</strong><br/>{item.pickup || 'Arrange directly with seller'}</p><p><strong>Seller</strong><br/>{item.seller}</p></div>
      <p className="muted">Status: {item.status}</p>
      {item.owner==='you'
        ? <button className="sell-cta" onClick={()=>account?startEdit(item):setAuthOpen(true)}>{account?'Edit your listing':'Sign in to edit'}</button>
       : item.status==='sold'
         ? <p className="fineprint">This item is marked as sold.</p>
         : <a className="sell-cta contact-seller" href={`mailto:${item.sellerEmail}?subject=${subject}&body=${body}`}>✉ Contact seller</a>}
    </section>
   </div>;
  })()}
  {showCompare&&compare.length>0&&(()=>{
   const picked=compare.map(id=>items.find(x=>x.id===id)).filter(Boolean);
   const rows=[['Price',i=><strong className="cmp-price">EGP {i.price.toLocaleString()}</strong>],['Condition',i=>cap(i.condition)],['Category',i=>cap(i.category)],['Pickup',i=>i.pickup||'Arrange with seller'],['Seller',i=>i.seller],['Status',i=><span className={i.status==='sold'?'soldstatus':'instock'}>{i.status.toUpperCase()}</span>]];
   return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setShowCompare(false)}>
    <section className="compare-modal" role="dialog" aria-modal="true" aria-label="Compare items">
     <button className="close" aria-label="Close comparison" onClick={()=>setShowCompare(false)}>×</button>
     <div className="modal-head"><p className="section-kicker">SIDE BY SIDE</p><h2>Compare items</h2><p>Up to three listings at once, so you can weigh price and condition before messaging a seller.</p></div>
     <div className="cmp-scroll"><table className="cmp-table">
      <thead><tr><th className="cmp-corner" aria-label="Attribute"></th>{picked.map(i=><th key={i.id} scope="col"><span className="cmp-emoji" aria-hidden="true">{i.emoji||'📦'}</span><span className="cmp-title">{i.title}</span></th>)}</tr></thead>
      <tbody>
       <tr><th scope="row">Photo</th>{picked.map(i=><td key={i.id}><ListingImage src={i.photos?.[0]} alt={i.title} emoji={i.emoji} className="cmp-photo" /></td>)}</tr>
       {rows.map(([label,render])=><tr key={label}><th scope="row">{label}</th>{picked.map(i=><td key={i.id}>{render(i)}</td>)}</tr>)}
       <tr><th scope="row">Actions</th>{picked.map(i=><td key={i.id}><div className="cmp-actions"><button type="button" onClick={()=>{setSelected(i.id);setShowCompare(false);}}>View details</button><button type="button" onClick={()=>toggleCompare(i.id)}>Remove</button></div></td>)}</tr>
      </tbody>
     </table></div>
    </section>
   </div>;
  })()}
  {authOpen&&!account&&<div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setAuthOpen(false)}>
   <section className="sell-modal auth-modal" role="dialog" aria-modal="true" aria-label="Sign in">
    <button className="close" aria-label="Close sign in" onClick={()=>setAuthOpen(false)}>×</button>
    <div className="modal-head"><p className="section-kicker">CAMPUS EXCHANGE</p><h2>Sign in to sell</h2><p>Store your name and contact email in this browser so buyers know who is selling. No password needed for this demo.</p></div>
    <form onSubmit={doSignIn}><div className="field-grid"><label><span>Name *</span><input value={authForm.name} onChange={e=>setAuthForm(f=>({...f,name:e.target.value}))} placeholder="e.g. You or your display name"/></label><label><span>Contact email *</span><input type="email" value={authForm.email} onChange={e=>setAuthForm(f=>({...f,email:e.target.value}))} placeholder="you@example.com"/></label></div>{authErr&&<p className="alert" role="alert">{authErr}</p>}<div className="modal-foot"><button type="button" onClick={()=>setAuthOpen(false)}>Cancel</button><button className="sell-cta" type="submit">Sign in</button></div></form>
   </section>
  </div>}
  {editor&&<div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setEditor(null)}><section className="sell-modal" role="dialog" aria-modal="true" aria-label={editor.id?'Edit item':'Sell item'}><div className="modal-head"><div><p className="section-kicker">CAMPUS EXCHANGE</p><h2>{editor.id?'Edit your listing':'Sell an item'}</h2><p>Add the details and we'll take care of the rest.</p></div><button className="close" onClick={()=>setEditor(null)}>×</button></div><form onSubmit={submit}><div className="field-grid"><label><span>Item title *</span><input value={editor.form.title} aria-invalid={!!ferr.title} onChange={e=>setEditor(s=>({...s,form:{...s.form,title:e.target.value}}))} placeholder="What are you selling?"/>{ferr.title&&<em className="fielderr">{ferr.title}</em>}</label><label><span>Price (EGP) *</span><input type="number" min="0" step="0.01" aria-invalid={!!ferr.price} value={editor.form.price} onChange={e=>setEditor(s=>({...s,form:{...s.form,price:e.target.value}}))} placeholder="e.g. 250"/>{ferr.price&&<em className="fielderr">{ferr.price}</em>}</label><label><span>Category *</span><select aria-invalid={!!ferr.category} value={editor.form.category} onChange={e=>setEditor(s=>({...s,form:{...s.form,category:e.target.value}}))}><option value="">Select</option>{categories.slice(1).map(c=><option value={c} key={c}>{cap(c)}</option>)}</select>{ferr.category&&<em className="fielderr">{ferr.category}</em>}</label><label><span>Condition *</span><select aria-invalid={!!ferr.condition} value={editor.form.condition} onChange={e=>setEditor(s=>({...s,form:{...s.form,condition:e.target.value}}))}><option value="">Select</option>{conditions.map(c=><option value={c} key={c}>{cap(c)}</option>)}</select>{ferr.condition&&<em className="fielderr">{ferr.condition}</em>}</label><label className="wide"><span>Description</span><textarea value={editor.form.description} onChange={e=>setEditor(s=>({...s,form:{...s.form,description:e.target.value}}))} placeholder="Description" rows="5"/></label><label className="wide"><span>Pickup / meetup location</span><input value={editor.form.pickup} onChange={e=>setEditor(s=>({...s,form:{...s.form,pickup:e.target.value}}))} placeholder="e.g. Library entrance or arrange on campus" /></label><div className="wide photo-picker"><span>Photos — paste an image link or upload from your device (up to 4)</span><div className="photo-add-row"><input value={editor.url||''} onChange={e=>setEditor(s=>({...s,url:e.target.value}))} placeholder="https:// image link, e.g. images.unsplash.com/..."/><button type="button" className="pickbtn" onClick={addImageUrl}>Add link</button><label className="upload-btn pickbtn">Upload photo<input type="file" accept="image/*" onChange={addPhotoFile}/></label></div>{imgErr&&<em className="fielderr">{imgErr}</em>}{editor.form.images.length>0&&<div className="photo-thumbs">{editor.form.images.map((src,index)=><span key={index} className="thumbwrap"><img src={src} alt={`Listing photo ${index+1}`}/><button type="button" aria-label={`Remove photo ${index+1}`} onClick={()=>removeImage(index)}>×</button></span>)}</div>}</div><label className="wide"><span>Seller contact email</span><input value={account.email} readOnly aria-readonly="true" className="readonly-input"/><small className="email-helper">Taken from your signed-in account ({account.name}), so buyers can contact you about this item.</small></label>{editor.id&&<label><span>Status</span><select aria-invalid={!!ferr.status} value={editor.form.status} onChange={e=>setEditor(s=>({...s,form:{...s.form,status:e.target.value}}))}><option value="active">Active</option><option value="sold">Sold</option></select>{ferr.status&&<em className="fielderr">{ferr.status}</em>}</label>}</div>{error&&<p className="alert" role="alert">{error}</p>}<div className="modal-foot"><button type="button" onClick={()=>setEditor(null)}>Cancel</button><button className="sell-cta" type="submit">{editor.id?'Save changes':'Publish item'}</button></div></form></section></div>}
 </div>;
}
