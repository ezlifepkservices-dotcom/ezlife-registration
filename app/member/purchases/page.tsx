"use client";

import { ArrowLeft, CheckCircle2, LoaderCircle, PackageCheck, Plus, ShoppingBag, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type MemberContext={memberId:string;fullName:string};
type ServiceRow={id:string;name:string|null};
type PackageRow={id:string;service_id:string;package_code:string;package_name:string;description:string|null;installment_amount:number;installment_count:number;family_allowed:boolean;min_family_members:number|null;max_family_members:number|null;balloting_start_referrals:number;completion_target_referrals:number};
type PurchaseRow={id:string;package_id:string|null;purchase_code:string;payment_status:string;purchase_status:string;balloting_status:string;admin_notes:string|null;services:{name:string|null}|{name:string|null}[]|null;product_packages:{package_name:string;installment_amount:number;installment_count:number;balloting_start_referrals:number;completion_target_referrals:number}|{package_name:string;installment_amount:number;installment_count:number;balloting_start_referrals:number;completion_target_referrals:number}[]|null};

const one=<T,>(v:T|T[]|null):T|null=>Array.isArray(v)?v[0]??null:v;
const purchaseCode=()=>`PUR-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().replaceAll("-","").slice(0,6).toUpperCase()}`;
const badge=(s:string)=>["active","verified","completed"].includes(s.toLowerCase())?"border-emerald-400/20 bg-emerald-400/10 text-emerald-300":["cancelled","rejected"].includes(s.toLowerCase())?"border-rose-400/20 bg-rose-400/10 text-rose-300":"border-amber-400/20 bg-amber-400/10 text-amber-300";

export default function MemberPurchasesPage(){
 const router=useRouter();
 const [member,setMember]=useState<MemberContext|null>(null);
 const [services,setServices]=useState<ServiceRow[]>([]);
 const [packages,setPackages]=useState<PackageRow[]>([]);
 const [purchases,setPurchases]=useState<PurchaseRow[]>([]);
 const [serviceId,setServiceId]=useState("");
 const [packageId,setPackageId]=useState("");
 const [accepted,setAccepted]=useState(false);
 const [loading,setLoading]=useState(true);
 const [saving,setSaving]=useState(false);

 async function load(){setLoading(true);try{
  const {data:{session}}=await supabase.auth.getSession(); if(!session?.user){router.replace("/member/login");return;}
  const {data:profile,error:pe}=await supabase.from("profiles").select("member_id,full_name,role,status,must_change_password").eq("auth_user_id",session.user.id).single();
  if(pe||!profile||profile.role!=="member"||profile.status!=="active"||!profile.member_id){await supabase.auth.signOut();router.replace("/member/login");return;}
  const {data:kyc,error:ke}=await supabase.from("member_kyc").select("status").eq("member_id",profile.member_id).limit(1); if(ke)throw new Error(ke.message);
  if(!["verified","approved"].includes((kyc?.[0]?.status??"").toLowerCase())){toast.error("Purchase se pehle KYC approval required hai.");router.replace("/member/kyc");return;}
  const [s,p,pr]=await Promise.all([
   supabase.from("services").select("id,name").order("name"),
   supabase.from("product_packages").select("id,service_id,package_code,package_name,description,installment_amount,installment_count,family_allowed,min_family_members,max_family_members,balloting_start_referrals,completion_target_referrals").eq("is_active",true).order("display_order"),
   supabase.from("purchases").select("id,package_id,purchase_code,payment_status,purchase_status,balloting_status,admin_notes,services(name),product_packages(package_name,installment_amount,installment_count,balloting_start_referrals,completion_target_referrals)").eq("member_id",profile.member_id).order("purchase_date",{ascending:false})
  ]);
  if(s.error)throw new Error(s.error.message);if(p.error)throw new Error(p.error.message);if(pr.error)throw new Error(pr.error.message);
  const ss=(s.data??[]) as ServiceRow[]; setMember({memberId:profile.member_id,fullName:profile.full_name});setServices(ss);setPackages((p.data??[]) as PackageRow[]);setPurchases((pr.data??[]) as PurchaseRow[]);if(ss[0])setServiceId(x=>x||ss[0].id);
 }catch(e){toast.error(e instanceof Error?e.message:"Purchase page load nahi hua.");}finally{setLoading(false);}}
 useEffect(()=>{void load();},[]);
 const visible=useMemo(()=>packages.filter(x=>x.service_id===serviceId),[packages,serviceId]);
 useEffect(()=>{if(!visible.some(x=>x.id===packageId))setPackageId(visible[0]?.id??"");},[visible,packageId]);
 const selected=useMemo(()=>packages.find(x=>x.id===packageId)??null,[packages,packageId]);
 async function submit(){if(!member||!serviceId||!packageId){toast.error("Service aur package select karein.");return;}if(!accepted){toast.error("Terms accept karein.");return;}if(purchases.some(x=>x.package_id===packageId&&["pending","active"].includes(x.purchase_status.toLowerCase()))){toast.error("Is package ki request already active/pending hai.");return;}setSaving(true);try{const {error}=await supabase.from("purchases").insert({member_id:member.memberId,service_id:serviceId,package_id:packageId,purchase_code:purchaseCode(),payment_status:"pending",purchase_status:"pending",balloting_status:"not_eligible"});if(error)throw new Error(error.message);toast.success("Package request admin approval ke liye submit ho gayi.");setAccepted(false);await load();}catch(e){toast.error(e instanceof Error?e.message:"Request submit nahi hui.");}finally{setSaving(false);}}
 if(loading)return <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white"><LoaderCircle className="h-8 w-8 animate-spin"/></main>;
 if(!member)return null;
 return <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl">
  <button onClick={()=>router.push("/member/dashboard")} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm font-bold text-slate-300"><ArrowLeft className="h-4 w-4"/>Back to Dashboard</button>
  <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8"><div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase text-emerald-300"><CheckCircle2 className="h-4 w-4"/>KYC Approved</div><h1 className="mt-5 text-3xl font-black">Select Service & Package</h1><p className="mt-3 text-slate-400">Registration wali service interest area thi. Actual purchase ke liye service aur phir package select karein.</p></section>
  <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
   <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6"><div className="flex items-center gap-3"><ShoppingBag className="h-6 w-6 text-violet-300"/><h2 className="text-xl font-black">New Purchase Request</h2></div>
    <p className="mt-6 text-sm font-bold">Step 1 — Select Service</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{services.map(s=><button key={s.id} onClick={()=>setServiceId(s.id)} className={`rounded-2xl border p-5 text-left ${serviceId===s.id?"border-violet-400/50 bg-violet-500/10":"border-slate-800 bg-slate-950"}`}><h3 className="font-black">{s.name??"Service"}</h3></button>)}</div>
    <p className="mt-7 text-sm font-bold">Step 2 — Select Package</p><div className="mt-3 space-y-4">{visible.length===0?<div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-500">No active package.</div>:visible.map(p=><button key={p.id} onClick={()=>setPackageId(p.id)} className={`w-full rounded-2xl border p-5 text-left ${packageId===p.id?"border-violet-400/50 bg-violet-500/10":"border-slate-800 bg-slate-950"}`}><div className="flex justify-between gap-3"><div><p className="text-xs font-bold text-violet-300">{p.package_code}</p><h3 className="mt-2 text-lg font-black">{p.package_name}</h3></div>{p.family_allowed&&<span className="self-start rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">Family</span>}</div>{p.description&&<p className="mt-3 text-sm text-slate-500">{p.description}</p>}<div className="mt-5 grid gap-3 text-sm text-slate-400 sm:grid-cols-2"><p>Installment: PKR {Number(p.installment_amount).toLocaleString("en-PK")}</p><p>Total Installments: {p.installment_count}</p><p>Balloting Starts: {p.balloting_start_referrals} Referrals</p><p>Completion Target: {p.completion_target_referrals} Referrals</p></div>{p.family_allowed&&<p className="mt-4 flex items-center gap-2 text-sm text-cyan-200"><UsersRound className="h-4 w-4"/>Family Size: {p.min_family_members??1}–{p.max_family_members??"Custom"}</p>}</button>)}</div>
    <label className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4"><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)} className="mt-1 accent-violet-500"/><span className="text-sm text-slate-400">I understand this package needs admin approval before payment.</span></label>
    <button onClick={()=>void submit()} disabled={saving||!selected||!accepted} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 font-black disabled:opacity-50">{saving?<LoaderCircle className="h-5 w-5 animate-spin"/>:<Plus className="h-5 w-5"/>}Submit Package Request</button>
   </section>
   <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6"><div className="flex items-center gap-3"><PackageCheck className="h-6 w-6 text-emerald-300"/><h2 className="text-xl font-black">Purchase History</h2></div><div className="mt-6 space-y-4">{purchases.length===0?<div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-500">No purchase request submitted.</div>:purchases.map(p=>{const pkg=one(p.product_packages);return <article key={p.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-5"><p className="text-xs font-bold text-violet-300">{p.purchase_code}</p><h3 className="mt-2 text-lg font-black">{pkg?.package_name??one(p.services)?.name??"Package"}</h3><div className="mt-4 flex flex-wrap gap-2"><span className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${badge(p.purchase_status)}`}>Purchase: {p.purchase_status}</span><span className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${badge(p.payment_status)}`}>Payment: {p.payment_status}</span></div>{p.purchase_status==="active"&&<button onClick={()=>router.push("/member/payments")} className="mt-4 min-h-11 w-full rounded-xl bg-violet-600 px-4 font-black">Open Payment</button>}{p.admin_notes&&<p className="mt-3 text-sm text-slate-400">Admin note: {p.admin_notes}</p>}</article>})}</div></section>
  </div>
 </div></main>;
}
