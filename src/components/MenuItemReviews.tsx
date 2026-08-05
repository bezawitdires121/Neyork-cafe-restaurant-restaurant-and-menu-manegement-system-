"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Star } from "lucide-react";
import { submitReview } from "@/lib/actions/reviews";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
};

export default function MenuItemReviews({
  itemId,
  lang,
  initialRating,
  initialCount,
}: {
  itemId: string;
  lang: "en" | "am";
  initialRating: number;
  initialCount: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const t = {
    reviews: lang === "en" ? "Reviews" : "ግምገማዎች",
    hide: lang === "en" ? "Hide" : "ደብቅ",
    leaveReview: lang === "en" ? "Leave a Review" : "ግምገማ ይስጡ",
    comment: lang === "en" ? "Share your thoughts..." : "አስተያየትዎ...",
    submit: lang === "en" ? "Submit Review" : "ላክ",
    thanks:
      lang === "en"
        ? "Thank you! Your review is awaiting approval."
        : "እናመሰግናለን! ግምገማዎ በመጠባበቅ ላይ ነው።",
    noReviews:
      lang === "en"
        ? "No reviews yet."
        : "ገና ግምገማ የለም።",
  };

  const toggle = async () => {
    const next = !expanded;
    setExpanded(next);

    if (next && reviews === null) {
      setLoading(true);

      const res = await fetch(`/api/menu-items/${itemId}/reviews`);
      const data = await res.json();

      setReviews(data);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const result = await submitReview({
      menuItemId: itemId,
      rating,
      comment: comment || undefined,
      language: lang,
    });

    if (result.success) {
      setSubmitted(true);
      setComment("");
    }
  };

  return (
   <div className="mt-3 border-t border-nyc-gold/15 pt-2">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-1">

          <Star
            size={15}
            className="fill-nyc-gold text-nyc-gold"
          />

          <span className="text-sm font-medium">
            {initialRating > 0
              ? initialRating.toFixed(1)
              : "—"}
          </span>

          <span className="text-xs text-nyc-taupe">
            ({initialCount})
          </span>

        </div>

        <button
          onClick={toggle}
          className="flex items-center gap-1 text-xs text-nyc-gold hover:text-nyc-gold-light transition-colors"
        >
          {expanded ? t.hide : t.reviews}

          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
          >
            <ChevronDown size={14} />
          </motion.div>

        </button>

      </div>

      <AnimatePresence>

        {expanded && (

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >

            <div className="mt-4 rounded-2xl border border-nyc-gold/15 bg-nyc-gold/5 p-4">

              {!submitted ? (
                <>
                  <p className="text-sm font-medium mb-3">
                    {t.leaveReview}
                  </p>

                  <div className="flex gap-1 mb-3">

                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setRating(n)}
                        className="transition-transform hover:scale-125"
                      >
                        <Star
                          size={22}
                          className={
                            n <= rating
                              ? "fill-nyc-gold text-nyc-gold"
                              : "text-nyc-gold/30"
                          }
                        />
                      </button>
                    ))}

                  </div>

                  <textarea
                    value={comment}
                    onChange={(e) =>
                      setComment(e.target.value)
                    }
                    rows={3}
                    placeholder={t.comment}
                    className="w-full rounded-xl border border-nyc-gold/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-nyc-gold transition-colors resize-none"
                  />

                  <button
                    onClick={handleSubmit}
                    className="mt-3 rounded-full bg-nyc-gold px-5 py-2 text-sm font-medium text-nyc-base hover:bg-nyc-gold-light transition-colors"
                  >
                    {t.submit}
                  </button>
                </>
              ) : (
                <p className="text-sm text-green-500">
                  {t.thanks}
                </p>
              )}

            </div>

            <div className="mt-4 space-y-3">

              {loading && (
                <p className="text-sm text-nyc-taupe">
                  Loading...
                </p>
              )}

              {reviews &&
                reviews.length === 0 && (
                  <p className="text-sm text-nyc-taupe">
                    {t.noReviews}
                  </p>
                )}

              {reviews?.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-nyc-gold/10 bg-nyc-gold/5 p-3"
                >
                  <div className="flex gap-1 mb-2">

                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        size={14}
                        className={
                          n <= r.rating
                            ? "fill-nyc-gold text-nyc-gold"
                            : "text-nyc-gold/25"
                        }
                      />
                    ))}

                  </div>

                  {r.comment && (
                    <p className="text-sm text-nyc-taupe leading-relaxed">
                      {r.comment}
                    </p>
                  )}

                </div>
              ))}

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}