"use client";

import { ArrowLeft, CheckCircle2, Eye, LoaderCircle, Plus, RefreshCcw, Save, Search, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type Account={id:string;account_type:string;account_title:string;bank_name:string|null;account_number:string|null;iban:string|null;mobile_number:string|null;branch_name:string|null;instructions:string|null;is_active:boolean;display_order:number};
type Payment={id:string;purchase_id:string;payment_no:string;payment_method:string;amount:number;payment_date:string;reference_no:string|null;receipt_path:string;status:string;admin_notes:string|null;members:{full_name:string;email:string}|{full_name:string;email:string}[]|null;purchases:{purchase_code:string}|{purchase_code:string}[]|null};
const one=<T,>(v:T|T[]|null)=>Array.isArray(v)?v[0]??null:v;

export default function AdminPaymentsPage(){
  const [accounts,setAccounts]=useState<Account[]>([]);
  const [payments,setPayments]=useState<Payment[]>([]);
  const [search,setSearch]=useState("");
  const [notes,setNotes]=useState<Record<string,string>>({});
  const [savingId,setSavingId]=useState<string|null>(null);
  const [loading,setLoading]=useState(true);
  const [form,setForm]=useState({account_type:"bank",account_title:"",bank_name:"",account_number:"",iban:"",mobile_number:"",branch_name:"",instructions:""});

  async function load(){
    setLoading(true);
    try{
      const [a,p]=await Promise.all([
        supabase.from("payment_accounts").select("*").order("display_order"),
        supabase.from("payments").select("id,purchase_id,payment_no,payment_method,amount,payment_date,reference_no,receipt_path,status,admin_notes,members(full_name,email),purchases(purchase_code)").order("created_at",{ascending:false})
      ]);
      if(a.error)throw new Error(a.error.message);if(p.error)throw new Error(p.error.message);
      const rows=(p.data??[]) as Payment[];setAccounts((a.data??[]) as Account[]);setPayments(rows);
      const n:Record<string,string>={};rows.forEach(r=>n[r.id]=r.admin_notes??"");setNotes(n);
    }catch(e){toast.error(e instanceof Error?e.message:"Payments load nahi huay.");}
    finally{setLoading(false);}
  }

  useEffect(()=>{void load();},[]);
  const filtered=useMemo(()=>{const q=search.trim().toLowerCase();return q?payments.filter(p=>[p.payment_no,p.status,p.reference_no??"",one(p.members)?.full_name??"",one(p.members)?.email??""].join(" ").toLowerCase().includes(q)):payments;},[payments,search]);

  async function saveAccount(e:React.FormEvent){e.preventDefault();if(!form.account_title.trim()){toast.error("Account title required hai.");return;}
    const {error}=await supabase.from("payment_accounts").insert({...form,account_title:form.account_title.trim(),bank_name:form.bank_name.trim()||null,account_number:form.account_number.trim()||null,iban:form.iban.trim()||null,mobile_number:form.mobile_number.trim()||null,branch_name:form.branch_name.trim()||null,instructions:form.instructions.trim()||null,is_active:true,display_order:accounts.length});
    if(error){toast.error(error.message);return;}toast.success("Payment account added.");setForm({account_type:"bank",account_title:"",bank_name:"",account_number:"",iban:"",mobile_number:"",branch_name:"",instructions:""});await load();
  }

  async function openReceipt(path:string){const {data,error}=await supabase.storage.from("payment-receipts").createSignedUrl(path,600);if(error||!data?.signedUrl){toast.error(error?.message??"Receipt open nahi hui.");return;}window.open(data.signedUrl,"_blank","noopener,noreferrer");}

  async function updatePayment(p:Payment,status:"verified"|"rejected"){
    setSavingId(p.id);
    try{
      const {data:u}=await supabase.auth.getUser();
      const {error}=await supabase.from("payments").update({status,admin_notes:notes[p.id]?.trim()||null,reviewed_by:u.user?.id??null,reviewed_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq("id",p.id);
      if(error)throw new Error(error.message);
      const {error:pe}=await supabase.from("purchases").update(status==="verified"?{payment_status:"verified",balloting_status:"eligible",updated_at:new Date().toISOString()}:{payment_status:"rejected",balloting_status:"not_eligible",updated_at:new Date().toISOString()}).eq("id",p.purchase_id);
      if(pe)throw new Error(pe.message);
      toast.success(status==="verified"?"Payment verified; balloting eligible.":"Payment rejected.");await load();
    }catch(e){toast.error(e instanceof Error?e.message:"Payment update nahi hui.");}
    finally{setSavingId(null);}
  }

  return <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl">
    <Link href="/admin" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm font-bold text-slate-300"><ArrowLeft className="h-4 w-4"/>Back to Admin Dashboard</Link>
    <div className="mt-6 flex justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-violet-300">Finance</p><h1 className="mt-2 text-3xl font-black">Payments & Accounts</h1><p className="mt-2 text-slate-400">Receiving accounts configure karein aur member receipts verify karein.</p></div><button onClick={()=>void load()} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4"><RefreshCcw className="h-4 w-4"/>Refresh</button></div>

    <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-3"><Plus className="h-5 w-5 text-violet-300"/><h2 className="text-xl font-black">Add Payment Account</h2></div>
        <form onSubmit={saveAccount} className="mt-6 grid gap-4">
          {([["account_title","Account Title *"],["bank_name","Bank / Wallet Name"],["account_number","Account Number"],["iban","IBAN"],["mobile_number","Mobile Number"],["branch_name","Branch Name"]] as const).map(([f,l])=><label key={f}><span className="text-sm font-bold">{l}</span><input value={form[f]} onChange={e=>setForm(x=>({...x,[f]:e.target.value}))} className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"/></label>)}
          <label><span className="text-sm font-bold">Account Type</span><select value={form.account_type} onChange={e=>setForm(x=>({...x,account_type:e.target.value}))} className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"><option value="bank">Bank</option><option value="jazzcash">JazzCash</option><option value="easypaisa">Easypaisa</option><option value="cash_deposit">Cash Deposit</option><option value="other">Other</option></select></label>
          <label><span className="text-sm font-bold">Instructions</span><textarea value={form.instructions} onChange={e=>setForm(x=>({...x,instructions:e.target.value}))} rows={4} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"/></label>
          <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 font-black"><Save className="h-5 w-5"/>Save Account</button>
        </form>
        <div className="mt-8 border-t border-slate-800 pt-6"><h3 className="font-black">Configured Accounts</h3><div className="mt-4 space-y-3">{accounts.map(a=><div key={a.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4"><p className="font-black">{a.account_title}</p><p className="mt-2 text-sm text-slate-500">{a.bank_name??a.account_type}</p><p className="mt-1 text-sm text-slate-400">{a.account_number??a.iban??a.mobile_number??"No account detail"}</p></div>)}</div></div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-black">Payment Verification</h2>
        <div className="relative mt-5"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search payment, member or reference" className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 pl-11 pr-4"/></div>
        <div className="mt-5 space-y-4">{loading?<LoaderCircle className="mx-auto h-7 w-7 animate-spin"/>:filtered.length===0?<div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-500">No payment found.</div>:filtered.map(p=><article key={p.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <div className="flex justify-between gap-3"><div><p className="text-xs font-bold text-violet-300">{p.payment_no}</p><h3 className="mt-2 text-lg font-black">PKR {Number(p.amount).toLocaleString("en-PK")}</h3><p className="mt-2 text-sm text-slate-500">{one(p.members)?.full_name??"Unknown Member"} · {one(p.purchases)?.purchase_code??"No purchase"}</p></div><span className="self-start rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-bold capitalize text-amber-300">{p.status.replaceAll("_"," ")}</span></div>
          <button onClick={()=>void openReceipt(p.receipt_path)} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm font-bold text-violet-200"><Eye className="h-4 w-4"/>View Receipt</button>
          <textarea value={notes[p.id]??""} onChange={e=>setNotes(x=>({...x,[p.id]:e.target.value}))} rows={3} placeholder="Admin verification note" className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3"/>
          {(p.status==="pending"||p.status==="clarification_required")&&<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end"><button onClick={()=>void updatePayment(p,"rejected")} disabled={savingId===p.id} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-5 font-bold text-rose-300"><XCircle className="h-4 w-4"/>Reject</button><button onClick={()=>void updatePayment(p,"verified")} disabled={savingId===p.id} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 font-black"><CheckCircle2 className="h-4 w-4"/>Verify Payment</button></div>}
        </article>)}</div>
      </section>
    </div>
  </div></main>;
}
