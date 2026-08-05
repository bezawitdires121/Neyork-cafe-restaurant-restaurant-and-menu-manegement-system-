"use client";

export default function Error({
 reset,
}: {
 reset: () => void;
}) {

return (
<div className="min-h-screen flex items-center justify-center">
<div className="text-center">

<h2 className="text-2xl font-semibold">
Something went wrong
</h2>

<p className="mt-2 text-gray-500">
Please try again soon.
</p>

<button
onClick={()=>reset()}
className="mt-5 px-5 py-2 rounded-lg bg-nyc-gold"
>
Try Again
</button>

</div>
</div>
);

}