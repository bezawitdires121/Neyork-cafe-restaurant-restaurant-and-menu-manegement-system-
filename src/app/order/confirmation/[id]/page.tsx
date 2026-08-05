
import { prisma } from "@/lib/prisma";
import ClearCartOnLoad from "@/components/ClearCartOnLoad";
import ConfirmationContent from "@/components/ConfirmationContent";


export default async function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, floor: true, table: true },
  });

  if (!order) {
    return <div className="p-6 text-white bg-neutral-950 min-h-screen">Order not found.</div>;
  }

  return (
    <>
      <ClearCartOnLoad />
      <ConfirmationContent order={order} />
    </>
  );
}
