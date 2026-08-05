import { prisma } from "@/lib/prisma";
import { approveReview, deleteReview, toggleReviewFeatured } from "@/lib/actions/reviews";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: { menuItem: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Reviews</h1>
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className={`border rounded-md p-3 ${r.isApproved ? "border-neutral-800" : "border-red-900 opacity-60"}`}>
            <div className="flex justify-between items-start">
              <div>
                <p>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)} — {r.language.toUpperCase()}</p>
                {r.menuItem && <p className="text-xs text-neutral-500">{r.menuItem.nameEn}</p>}
                {r.comment && <p className="text-sm text-neutral-300 mt-1">{r.comment}</p>}
              </div>
              <div className="flex gap-2">
                <form action={approveReview.bind(null, r.id, !r.isApproved)}>
                  <button type="submit" className="text-xs text-neutral-300 hover:text-white">
                    {r.isApproved ? "Hide" : "Approve"}
                  </button>
                </form>
                <form action={deleteReview.bind(null, r.id)}>
                  <button type="submit" className="text-xs text-red-400 hover:text-red-300">Delete</button>
                </form>
                <form action={toggleReviewFeatured.bind(null, r.id, !r.isFeatured)}>
  <button type="submit" className="text-xs text-yellow-500">
    {r.isFeatured ? "★ Featured" : "☆ Feature"}
  </button>
</form>
              </div>
            </div>
          </div>
        ))}
      </div>
      {reviews.length === 0 && <p className="text-neutral-500">No reviews yet.</p>}
    </div>
  );
}