"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { submitReview } from "@/lib/actions/reviews";
import { motion } from "framer-motion";
type Review = {
  id: string;
  rating: number;
  comment: string | null;
  reviewerName: string | null;
  createdAt: Date;
  menuItem: { nameEn: string; nameAm: string } | null;
};

type MenuItem = {
  id: string;
  nameEn: string;
  nameAm: string;
};

type SelectedItem = {
  nameEn: string;
  nameAm: string;
  rating: number;
  ratingCount: number;
} | null;


function ReviewsInner({
  reviews,
  menuItems,
  preselectedItemId,
  selectedItem,
}: {
  reviews: Review[];
  menuItems: MenuItem[];
  preselectedItemId?: string;
  selectedItem?: SelectedItem;
}) {

  const { lang } = useLanguage();

  const [rating, setRating] = useState(5);
  const [reviewerName, setReviewerName] = useState("");
  const [comment, setComment] = useState("");
  const [menuItemId, setMenuItemId] = useState(preselectedItemId || "");
  const [submitted, setSubmitted] = useState(false);


  const t = {
    title: lang === "en" ? "Reviews" : "ግምገማዎች",
    subtitle:
      lang === "en"
        ? "What our guests are saying"
        : "እንግዶቻችን የሚሉት",

    share:
      lang === "en"
        ? "Share Your Experience"
        : "ተሞክሮዎን ያካፍሉ",

    yourName:
      lang === "en"
        ? "Your name (optional)"
        : "ስምዎ (አማራጭ)",

    generalOrItem:
      lang === "en"
        ? "General review (or select an item)"
        : "አጠቃላይ ግምገማ (ወይም ንጥል ይምረጡ)",

    comment:
      lang === "en"
        ? "Your review"
        : "ግምገማዎ",

    submit:
      lang === "en"
        ? "Submit Review"
        : "ግምገማ ላክ",

    thanks:
      lang === "en"
        ? "Thank you! Your review will appear once approved."
        : "እናመሰግናለን! ግምገማዎ ከተፈቀደ በኋላ ይታያል።",

    noReviews:
      lang === "en"
        ? "No reviews yet — be the first!"
        : "ገና ግምገማ የለም — የመጀመሪያው ይሁኑ!",

    anonymous:
      lang === "en"
        ? "Guest"
        : "እንግዳ",

    reviewsWord:
      lang === "en"
        ? "reviews"
        : "ግምገማዎች",
  };


  const handleSubmit = async () => {

    const result = await submitReview({
      menuItemId: menuItemId || undefined,
      reviewerName: reviewerName || undefined,
      rating,
      comment: comment || undefined,
      language: lang,
    });


    if (result.success) {
      setSubmitted(true);
      setComment("");
      setReviewerName("");
      setRating(5);
    }
  };


  return (
    <>

      {/* Header */}
      <section
  className="relative min-h-[420px] flex items-center justify-center px-6 text-center bg-cover bg-center"
  style={{ backgroundImage: "url('/images/review.jpg')" }}
>
  <div className="absolute inset-0 bg-black/60" />
 <motion.div
  className="relative z-10 max-w-2xl mx-auto"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7 }}
>
    <p className="text-nyc-gold-light text-sm tracking-[0.3em] uppercase mb-4">{t.subtitle}</p>
    <h1 className="font-display text-4xl md:text-5xl text-nyc-cream">{t.title}</h1>
    {selectedItem && (
      <p className="text-nyc-cream/80 mt-5">
        {lang === "en" ? selectedItem.nameEn : selectedItem.nameAm} — {"★".repeat(Math.round(selectedItem.rating))} ({selectedItem.ratingCount} {t.reviewsWord})
      </p>
    )}
  </motion.div>
</section>






      {/* Reviews */}
      <section className="bg-nyc-cream py-16 px-6">

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

       {reviews.map((r, index) => (

            <motion.div
  key={r.id}
  initial={{ opacity: 0, y: 35 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{
    duration: 0.5,
    delay: index * 0.12,
  }}
  className="bg-white rounded-xl p-6 border border-nyc-taupe/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
>

              <p className="text-nyc-gold mb-2">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </p>


              {r.comment && (
                <p className="text-nyc-base/80 text-sm mb-4 italic">
                  &ldquo;{r.comment}&rdquo;
                </p>
              )}


              <div className="flex justify-between items-center text-xs text-nyc-taupe">

                <span className="font-medium text-nyc-base">
                  {r.reviewerName || t.anonymous}
                </span>

                <span>
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>

              </div>


              {r.menuItem && (
                <p className="text-xs text-nyc-taupe mt-1">
                  on {r.menuItem.nameEn}
                </p>
              )}

            </motion.div>

          ))}

        </div>


        {reviews.length === 0 && (
          <p className="text-center text-nyc-base/60 mt-8">
            {t.noReviews}
          </p>
        )}

      </section>



      {/* Share Experience */}
     <section className="bg-nyc-cream py-16 px-6">
<motion.div
  className="max-w-lg mx-auto bg-nyc-gold/10 border border-nyc-gold/20 rounded-[32px] p-8"
  initial={{ opacity: 0, y: 40, scale: 0.96 }}
  whileInView={{ opacity: 1, y: 0, scale: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
          <h2 className="font-display text-2xl text-nyc-base text-center mb-6">
            {t.share}
          </h2>


          {submitted ? (

            <p className="text-nyc-gold-light text-center">
              {t.thanks}
            </p>

          ) : (

            <div className="space-y-3">


              <input
                value={reviewerName}
                onChange={(e)=>setReviewerName(e.target.value)}
                placeholder={t.yourName}
                className="w-full px-4 py-3 rounded-md bg-white border border-nyc-gold/20 text-nyc-base"
              />


              <select
                value={menuItemId}
                onChange={(e)=>setMenuItemId(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-white border border-nyc-gold/20 text-nyc-base"
              >

                <option value="">
                  {t.generalOrItem}
                </option>


                {menuItems.map((m)=>(
                  <option key={m.id} value={m.id}>
                    {lang === "en" ? m.nameEn : m.nameAm}
                  </option>
                ))}

              </select>



              <div className="flex gap-2">

                {[1,2,3,4,5].map((n)=>(

                  <button
                    key={n}
                    onClick={()=>setRating(n)}
                    className={`text-3xl ${
                      n <= rating
                      ? "opacity-100"
                      : "opacity-30"
                    }`}
                  >
                    ★
                  </button>

                ))}

              </div>



              <textarea
                value={comment}
                onChange={(e)=>setComment(e.target.value)}
                placeholder={t.comment}
                rows={3}
                className="w-full px-4 py-3 rounded-md bg-white border border-nyc-gold/15 text-nyc-base"
              />

        



              <button
                onClick={handleSubmit}
                className="w-full py-3 rounded-full bg-nyc-gold text-nyc-base font-medium hover:bg-nyc-gold-light transition"
              >
                {t.submit}
              </button>


            </div>

          )}

        </motion.div>

      </section>


    </>
  );
}



export default function ReviewsPageContent(props:{
  reviews: Review[];
  menuItems: MenuItem[];
  preselectedItemId?: string;
  selectedItem?: SelectedItem;
}){

  return <ReviewsInner {...props}/>;

}