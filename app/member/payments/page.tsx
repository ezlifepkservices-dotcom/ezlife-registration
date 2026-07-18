"use client";

import { ArrowLeft, Banknote, Copy, LoaderCircle, Receipt, Send, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type Account={id:string;account_title:string;bank_name:string|null;account_number:string|null;iban:string|null;mobile_number:string|null;branch_name:string|null;instructions:string|null};
type Purchase={id:string;purchase_code:string;services:{name:string|null}|{name:string|null}[]|null};
type Payment={id:string;payment_no:string;amount:number;status:string;admin_notes:string|null;created_at:string};

const one=<T,>(v:T|T[]|null)=>Array.isArray(v)?v[0]??null:v;
const makeNo=()=>`PAY-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().replaceAll("-","").slice(0,6).toUpperCase()}`;

export default function MemberPaymentsPage(){
  const router=useRouter();
  const [memberId,setMemberId]=useState("");
  const [authId,setAuthId]=useState("");
  const [accounts,setAccounts]=useState<Account[]>([]);
  const [purchases,setPurchases]=useState<Purchase[]>([]);
  const [payments,setPayments]=useState<Payment[]>([]);
  const [purchaseId,setPurchaseId]=useState("");
  const [accountId,setAccountId]=useState("");
  const [method,setMethod]=useState("bank_transfer");
  const [amount,setAmount]=useState("");
  const [date,setDate]=useState(new Date().toISOString().slice(0,10));
  const [reference,setReference]=useState("");
  const [remarks,setRemarks]=useState("");
  const [receipt,setReceipt]=useState<File|null>(null);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);

  async function load(){
    setLoading(true);
    try{
      const {data:{session}}=await supabase.auth.getSession();
      if(!session?.user){router.replace("/member/login");return;}
      const {data:profile,error:pe}=await supabase.from("profiles").select("member_id,role,status").eq("auth_user_id",session.user.id).single();
      if(pe||!profile||profile.role!=="member"||profile.status!=="active"||!profile.member_id){await supabase.auth.signOut();router.replace("/member/login");return;}
      const [a,p,pm]=await Promise.all([
        supabase.from("payment_accounts").select("id,account_title,bank_name,account_number,iban,mobile_number,branch_name,instructions").eq("is_active",true).order("display_order"),
        supabase.from("purchases").select("id,purchase_code,services(name)").eq("member_id",profile.member_id).eq("purchase_status","active").order("purchase_date",{ascending:false}),
        supabase.from("payments").select("id,payment_no,amount,status,admin_notes,created_at").eq("member_id",profile.member_id).order("created_at",{ascending:false})
      ]);
      if(a.error)throw new Error(a.error.message); if(p.error)throw new Error(p.error.message); if(pm.error)throw new Error(pm.error.message);
      const aa=(a.data??[]) as Account[], pp=(p.data??[]) as Purchase[];
      setMemberId(profile.member_id);setAuthId(session.user.id);setAccounts(aa);setPurchases(pp);setPayments((pm.data??[]) as Payment[]);
      if(pp[0])setPurchaseId(x=>x||pp[0].id); if(aa[0])setAccountId(x=>x||aa[0].id);
    }catch(e){toast.error(e instanceof Error?e.message:"Payments load nahi huay.");}
    finally{setLoading(false);}
  }

  useEffect(()=>{void load();},[]);
  const selected=useMemo(()=>accounts.find(a=>a.id===accountId)??null,[accounts,accountId]);

  async function copy(v:string|null){if(!v)return;await navigator.clipboard.writeText(v);toast.success("Copied.");}

  async function submit(e:React.FormEvent){
    e.preventDefault();
    if(!purchaseId||!accountId||!amount||!date||!receipt){toast.error("Purchase, account, amount, date aur receipt required hain.");return;}
    if(receipt.size>5*1024*1024){toast.error("Receipt maximum 5 MB honi chahiye.");return;}
    setSaving(true);
    try{
      const ext=receipt.name.split(".").pop()?.toLowerCase()||"jpg";
      const path=`${authId}/${purchaseId}/${Date.now()}.${ext}`;
      const {error:ue}=await supabase.storage.from("payment-receipts").upload(path,receipt,{upsert:false,contentType:receipt.type});
      if(ue)throw new Error(ue.message);
      const {error}=await supabase.from("payments").insert({
        purchase_id:purchaseId,member_id:memberId,payment_account_id:accountId,payment_no:makeNo(),
        payment_method:method,amount:Number(amount),payment_date:date,reference_no:reference.trim()||null,
        receipt_path:path,remarks:remarks.trim()||null,status:"pending"
      });
      if(error)throw new Error(error.message);
      await supabase.from("purchases").update({payment_status:"submitted",updated_at:new Date().toISOString()}).eq("id",purchaseId);
      toast.success("Payment proof submitted for verification.");
      setAmount("");setReference("");setRemarks("");setReceipt(null);await load();
    }catch(e){toast.error(e instanceof Error?e.message:"Payment submit nahi hui.");}
    finally{setSaving(false);}
  }

  if(loading)return <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white"><LoaderCircle className="h-8 w-8 animate-spin"/></main>;

  return <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <button onClick={()=>router.push("/member/dashboard")} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm font-bold text-slate-300"><ArrowLeft className="h-4 w-4"/>Back to Dashboard</button>
      <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
        <h1 className="text-3xl font-black">Payment Accounts & Receipt Upload</h1>
        <p className="mt-3 text-slate-400">Neeche EZ Life ka active account select karein, payment karein aur receipt upload karein.</p>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {accounts.length===0?<div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8 text-center text-slate-500">Admin ne abhi payment account configure nahi kiya.</div>:
        accounts.map(a=><button key={a.id} onClick={()=>setAccountId(a.id)} className={`rounded-2xl border p-5 text-left ${accountId===a.id?"border-violet-400/50 bg-violet-500/10":"border-slate-800 bg-slate-900"}`}>
          <div className="flex items-center gap-3"><Banknote className="h-5 w-5 text-violet-300"/><h3 className="font-black">{a.account_title}</h3></div>
          <div className="mt-4 space-y-2 text-sm text-slate-400">
            {a.bank_name&&<p>Bank: {a.bank_name}</p>}
            {a.account_number&&<p className="flex justify-between gap-2">Account: {a.account_number}<span onClick={e=>{e.stopPropagation();void copy(a.account_number)}}><Copy className="h-4 w-4"/></span></p>}
            {a.iban&&<p className="flex justify-between gap-2 break-all">IBAN: {a.iban}<span onClick={e=>{e.stopPropagation();void copy(a.iban)}}><Copy className="h-4 w-4"/></span></p>}
            {a.mobile_number&&<p>Mobile: {a.mobile_number}</p>}
            {a.branch_name&&<p>Branch: {a.branch_name}</p>}
            {a.instructions&&<p className="pt-2 leading-6 text-slate-500">{a.instructions}</p>}
          </div>
        </button>)}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={submit} className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-black">Submit Payment Proof</h2>
          <div className="mt-6 grid gap-5">
            <label><span className="text-sm font-bold">Purchase *</span><select value={purchaseId} onChange={e=>setPurchaseId(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4">{purchases.map(p=><option key={p.id} value={p.id}>{p.purchase_code} — {one(p.services)?.name??"EZ Life Service"}</option>)}</select></label>
            <label><span className="text-sm font-bold">Payment Account *</span><select value={accountId} onChange={e=>setAccountId(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4">{accounts.map(a=><option key={a.id} value={a.id}>{a.account_title}</option>)}</select></label>
            <label><span className="text-sm font-bold">Method *</span><select value={method} onChange={e=>setMethod(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"><option value="bank_transfer">Bank Transfer</option><option value="jazzcash">JazzCash</option><option value="easypaisa">Easypaisa</option><option value="cash_deposit">Cash Deposit</option><option value="other">Other</option></select></label>
            <label><span className="text-sm font-bold">Amount *</span><input type="number" min="1" value={amount} onChange={e=>setAmount(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4" placeholder="10000"/></label>
            <label><span className="text-sm font-bold">Payment Date *</span><input type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"/></label>
            <label><span className="text-sm font-bold">Reference Number</span><input value={reference} onChange={e=>setReference(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4"/></label>
            <label className="cursor-pointer"><span className="text-sm font-bold">Receipt *</span><div className="mt-2 flex min-h-24 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950 p-4 text-sm text-slate-400"><input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" onChange={e=>setReceipt(e.target.files?.[0]??null)}/><Upload className="mr-2 h-4 w-4"/>{receipt?.name??"Click to upload receipt"}</div></label>
            <label><span className="text-sm font-bold">Remarks</span><textarea value={remarks} onChange={e=>setRemarks(e.target.value)} rows={4} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"/></label>
            <button type="submit" disabled={saving||!selected||purchases.length===0} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 font-black disabled:opacity-50">{saving?<LoaderCircle className="h-5 w-5 animate-spin"/>:<Send className="h-5 w-5"/>}Submit Payment</button>
          </div>
        </form>

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3"><Receipt className="h-5 w-5 text-emerald-300"/><h2 className="text-xl font-black">Payment History</h2></div>
          <div className="mt-6 space-y-4">
            {payments.length===0?<div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-500">No payment submitted yet.</div>:
            payments.map(p=><article key={p.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex justify-between gap-3"><div><p className="text-xs font-bold text-violet-300">{p.payment_no}</p><h3 className="mt-2 text-lg font-black">PKR {Number(p.amount).toLocaleString("en-PK")}</h3></div><span className="self-start rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-bold capitalize text-amber-300">{p.status.replaceAll("_"," ")}</span></div>
              {p.admin_notes&&<p className="mt-3 rounded-xl border border-slate-800 p-3 text-sm text-slate-400">Admin note: {p.admin_notes}</p>}
            </article>)}
          </div>
        </section>
      </div>
    </div>
  </main>;
}
