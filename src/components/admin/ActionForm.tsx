"use client";

import { useTransition } from "react";
import { toast } from "sonner";

export default function ActionForm({
  action,
  children,
  className,
}: {
  action: (formData: FormData) => Promise<any>;
  children: React.ReactNode;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        const result = await action(formData);

        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("Action completed successfully");
        }
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <form
      action={handleSubmit}
      className={className}
    >
      {children}

      {pending && (
        <span className="text-xs text-neutral-400 ml-2">
          Saving...
        </span>
      )}
    </form>
  );
}