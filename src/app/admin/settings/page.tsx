import { prisma } from "@/lib/prisma";
import { updateRestaurantSettings } from "@/lib/actions/restaurant";
import ActionForm from "@/components/admin/ActionForm";

export default async function SettingsPage() {
  const restaurant = await prisma.restaurant.findFirst();

  const social = (restaurant?.socialLinks as Record<string, string>) || {};

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        Restaurant Settings
      </h1>


      <ActionForm
        action={updateRestaurantSettings}
        className="space-y-4 max-w-xl"
      >

        <Field
          label="Restaurant Name"
          name="name"
          defaultValue={restaurant?.name ?? ""}
          required
        />


        <Field
          label="Restaurant Name (Amharic)"
          name="nameAm"
          defaultValue={restaurant?.nameAm ?? ""}
        />


        <Field
          label="Description"
          name="description"
          defaultValue={restaurant?.description ?? ""}
          textarea
        />


        <Field
          label="Our Story (short preview)"
          name="storyContent"
          defaultValue={restaurant?.storyContent ?? ""}
          textarea
        />


        <Field
          label="Address"
          name="address"
          defaultValue={restaurant?.address ?? ""}
        />


        <Field
          label="Latitude"
          name="latitude"
          defaultValue={String(restaurant?.latitude ?? "")}
          type="number"
          step="0.000001"
        />


        <Field
          label="Longitude"
          name="longitude"
          defaultValue={String(restaurant?.longitude ?? "")}
          type="number"
          step="0.000001"
        />


        <Field
          label="Phone"
          name="phone"
          defaultValue={restaurant?.phone ?? ""}
        />


        <Field
          label="Email"
          name="email"
          defaultValue={restaurant?.email ?? ""}
        />


        <Field
          label="Wi-Fi Password"
          name="wifiPassword"
          defaultValue={restaurant?.wifiPassword ?? ""}
        />


        <Field
          label="Exchange Rate (ETB per 1 USD)"
          name="exchangeRate"
          defaultValue={String(restaurant?.exchangeRate ?? "")}
          type="number"
          step="0.01"
        />


        <Field
          label="Telebirr Number"
          name="telebirrNumber"
          defaultValue={restaurant?.telebirrNumber ?? ""}
        />


        <Field
          label="Instagram Link"
          name="instagramLink"
          defaultValue={social.instagram ?? ""}
        />


        <Field
          label="TikTok Link"
          name="tiktokLink"
          defaultValue={social.tiktok ?? ""}
        />


        <button
          type="submit"
          className="px-4 py-2 bg-white text-black rounded-md font-medium hover:bg-neutral-200 transition"
        >
          Save Settings
        </button>


      </ActionForm>

    </div>
  );
}



function Field({
  label,
  name,
  defaultValue,
  textarea,
  type = "text",
  step,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  textarea?: boolean;
  type?: string;
  step?: string;
  required?: boolean;
}) {

  return (
    <div>

      <label className="block text-sm text-neutral-400 mb-1">
        {label}
      </label>


      {textarea ? (

        <textarea
          name={name}
          defaultValue={defaultValue}
          required={required}
          className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-white"
          rows={3}
        />

      ) : (

        <input
          type={type}
          step={step}
          name={name}
          defaultValue={defaultValue}
          required={required}
          className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-white"
        />

      )}

    </div>
  );
}