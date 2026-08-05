"use client";

import { useCartStore } from "@/lib/cart-store";
import { useLanguage } from "@/lib/language-context";
import { useState, useEffect } from "react";
import { createOrder } from "@/lib/actions/orders";
import { useRouter } from "next/navigation";
import {
  UtensilsCrossed,
  Package,
  Truck,
  Minus,
  Plus,
  Trash2,
  Wallet,
  Smartphone,
  Landmark,
} from "lucide-react";

type Floor = { id: string; name: string; nameAm?: string | null; tables: { id: string; number: string; isEnabled: boolean }[] };
type BankAccount = { bank: string; accountNumber: string; accountName?: string | null };
type RestaurantInfo = { telebirrNumber: string; bankAccounts: BankAccount[] };

const translations = {
  en: {
    title: "Your Order",
    empty: "Your cart is empty.",
    browseMenu: "Browse Menu",
    total: "Total",
    dineIn: "Dine In",
    takeaway: "Take Away",
    delivery: "Delivery",
    selectFloor: "Select floor",
    selectTable: "Select table",
    table: "Table",
    loadingFloors: "Loading floors...",
    noFloors: "No floors available. Please contact staff.",
    packaging: "Packaging preference",
    packagingAluminum: "Aluminum container",
    packagingStandard: "Standard container",
    optionalFloorNote: "Floor (optional, for waiter delivery)",
    optionalTableNote: "Table (optional)",
    nameOptional: "Name (optional)",
    fullName: "Full name",
    phoneNumber: "Phone number",
    deliveryAddress: "Delivery address",
    pickupNote: "Any notes for pickup (optional)",
    paymentMethod: "Payment Method",
    cash: "Cash",
    telebirr: "Telebirr",
    mobileBanking: "Mobile Banking",
    telebirrInstructions: "Send payment to this Telebirr number, then confirm below:",
    bankInstructions: "Send payment to one of these accounts, then confirm below:",
    accountName: "Account name",
    confirmPayment: "I have sent the payment",
    submit: "Place Order",
    submitting: "Placing order...",
    errorEmpty: "Your cart is empty.",
    errorFloorTable: "Please select a floor and table.",
    errorDelivery: "Name, phone, and address are required for delivery.",
    errorPaymentConfirm: "Please confirm you have sent the payment before placing the order.",
    errorGeneric: "Something went wrong. Please try again.",
  cashNoteDineTakeaway: "Please pay the money to the waiter that served you after receiving a receipt.",
cashNoteDelivery: "Please pay the money to the person who delivered your order.",
  },
  am: {
    title: "የእርስዎ ትዕዛዝ",
    empty: "ጋሪዎ ባዶ ነው።",
    browseMenu: "ምናሌ ይመልከቱ",
    total: "ጠቅላላ",
    dineIn: "በቦታው ይመገቡ",
    takeaway: "ውሰድ",
    delivery: "ማድረስ",
    selectFloor: "ወለል ይምረጡ",
    selectTable: "ጠረጴዛ ይምረጡ",
    table: "ጠረጴዛ",
    loadingFloors: "ወለሎች እየተጫኑ ነው...",
    noFloors: "ምንም ወለል የለም። እባክዎ ሰራተኛን ያነጋግሩ።",
    packaging: "የማሸጊያ ምርጫ",
    packagingAluminum: "አልሙኒየም መያዣ",
    packagingStandard: "መደበኛ መያዣ",
    optionalFloorNote: "ወለል (አማራጭ፣ አስተናጋጅ እንዲያመጣ)",
    optionalTableNote: "ጠረጴዛ (አማራጭ)",
    nameOptional: "ስም (አማራጭ)",
    fullName: "ሙሉ ስም",
    phoneNumber: "ስልክ ቁጥር",
    deliveryAddress: "የመላኪያ አድራሻ",
    pickupNote: "ለመውሰድ ማንኛውም ማስታወሻ (አማራጭ)",
    paymentMethod: "የክፍያ ዘዴ",
    cash: "ጥሬ ገንዘብ",
    telebirr: "ቴሌብር",
    mobileBanking: "ሞባይል ባንኪንግ",
    telebirrInstructions: "ክፍያውን ወደዚህ የቴሌብር ቁጥር ይላኩ፣ ከዚያ ከታች ያረጋግጡ፦",
    bankInstructions: "ክፍያውን ወደ አንዱ ከዚህ በታች ወዳሉት አካውንቶች ይላኩ፣ ከዚያ ያረጋግጡ፦",
    accountName: "የአካውንት ስም",
    confirmPayment: "ክፍያውን ልኬያለሁ",
    submit: "ትዕዛዝ ላክ",
    submitting: "ትዕዛዝ በመላክ ላይ...",
    errorEmpty: "ጋሪዎ ባዶ ነው።",
    errorFloorTable: "እባክዎ ወለል እና ጠረጴዛ ይምረጡ።",
    errorDelivery: "ለማድረስ ስም፣ ስልክ እና አድራሻ ያስፈልጋሉ።",
    errorPaymentConfirm: "ትዕዛዝ ከመላክዎ በፊት ክፍያ መላክዎን ያረጋግጡ።",
    errorGeneric: "የሆነ ስህተት ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።",
  cashNoteDineTakeaway: "እባክዎ ደረሰኝዎን ከተቀበሉ በኋላ ላገለገለዎት አስተናጋጅ ገንዘቡን ይክፈሉ።",
cashNoteDelivery: "እባክዎ ትዕዛዝዎን ላመጣልዎት ሰው ገንዘቡን ይክፈሉ።",
  },
};

const orderTypeIcons = { DINE_IN: UtensilsCrossed, TAKEAWAY: Package, DELIVERY: Truck };
const paymentIcons = { CASH: Wallet, TELEBIRR: Smartphone, MOBILE_BANKING: Landmark };

function OrderPageContent() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const router = useRouter();
  const { items, updateQuantity, removeItem, totalETB, orderType: storedType, setOrderType: setStoredType } = useCartStore();

  const [floors, setFloors] = useState<Floor[]>([]);
  const [floorsLoading, setFloorsLoading] = useState(true);
  const [floorsError, setFloorsError] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null);

  const [orderType, setOrderTypeLocal] = useState<"DINE_IN" | "TAKEAWAY" | "DELIVERY">(storedType || "DINE_IN");
  const setOrderType = (t: "DINE_IN" | "TAKEAWAY" | "DELIVERY") => {
    setOrderTypeLocal(t);
    setStoredType(t);
  };

  const [floorId, setFloorId] = useState("");
  const [tableId, setTableId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [packaging, setPackaging] = useState("");
  const [pickupNote, setPickupNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "TELEBIRR" | "MOBILE_BANKING">("CASH");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/floors")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load floors");
        return r.json();
      })
      .then((data) => {
        setFloors(data);
        setFloorsLoading(false);
      })
      .catch(() => {
        setFloorsError(true);
        setFloorsLoading(false);
      });

    fetch("/api/restaurant-info")
      .then((r) => r.json())
      .then(setRestaurantInfo)
      .catch(() => setRestaurantInfo({ telebirrNumber: "", bankAccounts: [] }));
  }, []);

  useEffect(() => {
    setPaymentConfirmed(false);
  }, [paymentMethod]);

  const selectedFloor = floors.find((f) => f.id === floorId);

  const handleSubmit = async () => {
    setError("");
    if (items.length === 0) return setError(t.errorEmpty);
    if (orderType === "DINE_IN" && (!floorId || !tableId)) return setError(t.errorFloorTable);
    if (orderType === "DELIVERY" && (!customerName || !phone || !address)) return setError(t.errorDelivery);
    if ((paymentMethod === "TELEBIRR" || paymentMethod === "MOBILE_BANKING") && !paymentConfirmed)
      return setError(t.errorPaymentConfirm);

    setSubmitting(true);
    const result = await createOrder({
      type: orderType,
      floorId: floorId || undefined,
      tableId: tableId || undefined,
      customerName: customerName || undefined,
      phone: phone || undefined,
      address: orderType === "TAKEAWAY" ? pickupNote || undefined : address || undefined,
      packaging: packaging || undefined,
      paymentMethod,
      paymentConfirmed,
      items: items.map((i) => ({ menuItemId: i.id, quantity: i.quantity })),
    });
    setSubmitting(false);
if (!result.success) return setError(result.error || t.errorGeneric);
localStorage.setItem("nyc-active-order", JSON.stringify({ orderId: result.orderId, placedAt: Date.now() }));
window.dispatchEvent(new Event("nyc-order-updated"));
router.push(`/order/confirmation/${result.orderId}`);
  };

  return (
    <div className="min-h-screen bg-nyc-base light:bg-nyc-cream text-nyc-cream light:text-nyc-base p-4 sm:p-6 transition-colors">
  <div className="max-w-xl mx-auto rounded-[var(--radius-panel)] border border-nyc-gold/10 bg-nyc-cream/[0.03] light:bg-nyc-base/[0.03] p-5 sm:p-7">
        <h1 className="font-display text-2xl mb-6">{t.title}</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-nyc-taupe mb-4">{t.empty}</p>
            <a href="/menu" className="inline-block px-5 py-2.5 bg-nyc-gold text-nyc-base rounded-full text-sm font-medium">
              {t.browseMenu}
            </a>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center rounded-xl border border-nyc-gold/10 bg-nyc-base/40 light:bg-nyc-cream light:border-nyc-taupe/20 p-3">
  <div>
    <p className="font-medium text-sm text-nyc-cream light:text-nyc-base">{lang === "en" ? item.nameEn : item.nameAm}</p>
    <p className="text-xs text-nyc-gold-light light:text-nyc-gold font-medium">{item.priceETB} ETB</p>
  </div>
                  <div className="flex items-center gap-2">
  <div className="flex items-center rounded-full border border-nyc-gold/20 bg-nyc-cream/5 overflow-hidden">
    <button
      onClick={() => updateQuantity(item.id, item.quantity - 1)}
      aria-label="Decrease quantity"
      className="w-8 h-8 flex items-center justify-center hover:bg-nyc-gold/20 transition-colors"
    >
      <Minus size={14} />
    </button>


    <div className="flex items-center gap-1 px-2 text-sm font-medium">
  <span className="text-nyc-cream light:text-nyc-base">{item.quantity}</span>
  <span className="text-nyc-taupe text-xs">×</span>
</div>

    <button
      onClick={() => updateQuantity(item.id, item.quantity + 1)}
      aria-label="Increase quantity"
      className="w-8 h-8 flex items-center justify-center hover:bg-nyc-gold/20 transition-colors"
    >
      <Plus size={14} />
    </button>
  </div>

 <button
  onClick={() => removeItem(item.id)}
  aria-label="Remove item"
  className="w-8 h-8 flex items-center justify-center rounded-full border border-red-400/20 text-red-400 hover:bg-red-400/10 transition-colors"
>
  <Trash2 size={15} strokeWidth={1.8} />
</button>
</div>
                </div>
              ))}
            </div>

      <p className="text-lg font-display mb-6 text-nyc-cream light:text-nyc-base">
  {t.total}: {totalETB()} ETB
</p>

          <div className="flex gap-1 mb-4 p-1 rounded-full bg-nyc-cream/5 light:bg-nyc-base/5 border border-nyc-gold/10">
              {(["DINE_IN", "TAKEAWAY", "DELIVERY"] as const).map((type) => {
                const Icon = orderTypeIcons[type];
                return (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-full text-xs font-medium transition-all ${
  orderType === type
    ? "bg-nyc-gold text-nyc-base shadow-sm"
    : "text-nyc-cream/80 light:text-nyc-base/80 hover:text-nyc-cream light:hover:text-nyc-base"
}`}
                  
                  >
                    <Icon size={18} strokeWidth={1.75} />
                    {type === "DINE_IN" ? t.dineIn : type === "TAKEAWAY" ? t.takeaway : t.delivery}
                  </button>



                );
              })}
            </div>

            {floorsLoading && (orderType === "DINE_IN" || orderType === "TAKEAWAY") && (
              <p className="text-nyc-taupe text-sm mb-4">{t.loadingFloors}</p>
            )}
            {floorsError && (orderType === "DINE_IN" || orderType === "TAKEAWAY") && (
              <p className="text-red-400 text-sm mb-4">{t.noFloors}</p>
            )}
{orderType === "DINE_IN" && !floorsLoading && !floorsError && (
  <div className="grid grid-cols-2 gap-3 mb-4">
    <select value={floorId} onChange={(e) => { setFloorId(e.target.value); setTableId(""); }} className="input">
      <option value="">{t.selectFloor}</option>
      {floors.map((f) => (
        <option key={f.id} value={f.id}>{lang === "en" ? f.name : (f.nameAm || f.name)}</option>
      ))}
    </select>
    <select value={tableId} onChange={(e) => setTableId(e.target.value)} className="input" disabled={!floorId}>
      <option value="">{t.selectTable}</option>
      {selectedFloor?.tables.filter((tb) => tb.isEnabled).map((tb) => (
        <option key={tb.id} value={tb.id}>{t.table} {tb.number}</option>
      ))}
    </select>
  </div>
)}

        {orderType === "TAKEAWAY" && (
  <div className="space-y-3 mb-4">
    <select value={packaging} onChange={(e) => setPackaging(e.target.value)} className="input w-full">
      <option value="">{t.packaging}</option>
      <option value="ALUMINUM">{t.packagingAluminum}</option>
      <option value="STANDARD">{t.packagingStandard}</option>
    </select>
    {!floorsLoading && !floorsError && (
      <div className="grid grid-cols-2 gap-3">
        <select value={floorId} onChange={(e) => { setFloorId(e.target.value); setTableId(""); }} className="input">
          <option value="">{t.optionalFloorNote}</option>
          {floors.map((f) => (
            <option key={f.id} value={f.id}>{lang === "en" ? f.name : (f.nameAm || f.name)}</option>
          ))}
        </select>
        <select value={tableId} onChange={(e) => setTableId(e.target.value)} className="input" disabled={!floorId}>
          <option value="">{t.optionalTableNote}</option>
          {selectedFloor?.tables.filter((tb) => tb.isEnabled).map((tb) => (
            <option key={tb.id} value={tb.id}>{t.table} {tb.number}</option>
          ))}
        </select>
      </div>
    )}
    <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder={t.nameOptional} className="input w-full" />
    <input value={pickupNote} onChange={(e) => setPickupNote(e.target.value)} placeholder={t.pickupNote} className="input w-full" />
  </div>
)}

            {orderType === "DELIVERY" && (
              <div className="space-y-3 mb-4">
                <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder={t.fullName} className="input w-full" required />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.phoneNumber} className="input w-full" required />
                <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t.deliveryAddress} className="input w-full" rows={2} required />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm text-nyc-taupe mb-2">{t.paymentMethod}</label>
<div className="flex gap-1 mb-3 p-1 rounded-full bg-nyc-cream/5 light:bg-nyc-base/5 border border-nyc-gold/10">
                {(["CASH", "TELEBIRR", "MOBILE_BANKING"] as const).map((m) => {
                  const Icon = paymentIcons[m];
                  return (
                    <button
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-full text-xs font-medium transition-all ${
 paymentMethod === m
    ? "bg-nyc-gold text-nyc-base shadow-sm"
    : "text-nyc-cream/80 light:text-nyc-base/80 hover:text-nyc-cream light:hover:text-nyc-base"
}`}
                    >
                      <Icon size={16} strokeWidth={1.75} />
                      {m === "CASH" ? t.cash : m === "TELEBIRR" ? t.telebirr : t.mobileBanking}
                    </button>
                    
                  );
                })}
              </div>
              </div>

            {paymentMethod === "CASH" && (
  <div className="rounded-xl border border-nyc-gold/20 bg-nyc-cream/5 light:bg-nyc-base/5 p-3 mb-2 text-sm text-nyc-cream light:text-nyc-base">
    {orderType === "DELIVERY" ? t.cashNoteDelivery : t.cashNoteDineTakeaway}
  </div>
)}

              {paymentMethod === "TELEBIRR" && (
              
                <div className="rounded-xl border border-nyc-gold/20 bg-nyc-cream/5 light:bg-nyc-base/5 p-3 mb-2">
  <p className="text-sm text-nyc-cream light:text-nyc-base mb-2">{t.telebirrInstructions}</p>
  <p className="text-lg font-mono font-semibold text-nyc-gold-light light:text-nyc-gold">{restaurantInfo?.telebirrNumber || "—"}</p>
</div>
              )}

              {paymentMethod === "MOBILE_BANKING" && (
                <div className="rounded-xl border border-nyc-gold/20 bg-nyc-cream/5 light:bg-nyc-base/5 p-3 mb-2 space-y-2">
  <p className="text-sm text-nyc-cream light:text-nyc-base mb-2">{t.bankInstructions}</p>
  {restaurantInfo?.bankAccounts && restaurantInfo.bankAccounts.length > 0 ? (
    restaurantInfo.bankAccounts.map((acc, idx) => (
      <div key={idx} className="text-sm border-t border-nyc-gold/10 pt-2 first:border-t-0 first:pt-0">
        <p className="font-medium text-nyc-cream light:text-nyc-base">{acc.bank}</p>
        <p className="font-mono text-nyc-gold-light light:text-nyc-gold">{acc.accountNumber}</p>
        {acc.accountName && <p className="text-nyc-cream/70 light:text-nyc-base/70 text-xs">{t.accountName}: {acc.accountName}</p>}
      </div>
    ))
  ) : (
    <p className="text-nyc-cream/70 light:text-nyc-base/70 text-sm">—</p>
  )}
</div>
              )}

              {(paymentMethod === "TELEBIRR" || paymentMethod === "MOBILE_BANKING") && (
                <label className="flex items-center gap-2 text-sm mt-2">
                  <input type="checkbox" checked={paymentConfirmed} onChange={(e) => setPaymentConfirmed(e.target.checked)} />
                  {t.confirmPayment}
                </label>
              )}
           

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3.5 bg-nyc-gold text-nyc-base rounded-full font-medium disabled:opacity-50 hover:brightness-110 transition-all active:scale-[0.98]"
            >
              {submitting ? t.submitting : t.submit}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function OrderPage() {
  return <OrderPageContent />;
}