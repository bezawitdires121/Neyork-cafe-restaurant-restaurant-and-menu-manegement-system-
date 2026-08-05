import { prisma } from "@/lib/prisma";
import {
  createFloor,
  deleteFloor,
  updateFloorName,
  createTable,
  toggleTableEnabled,
  deleteTable,
} from "@/lib/actions/floors";

import ActionForm from "@/components/admin/ActionForm";

export default async function FloorsPage() {
  const floors = await prisma.floor.findMany({
    include: { tables: true },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        Floors & Tables
      </h1>

      <ActionForm
        action={createFloor}
        className="flex gap-2 mb-8 max-w-lg flex-wrap"
      >
        <input
          name="name"
          placeholder="New floor name (English)"
          className="flex-1 px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-white min-w-[160px]"
          required
        />

        <input
          name="nameAm"
          placeholder="ስም (አማርኛ)"
          className="flex-1 px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-white min-w-[160px]"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-white text-black rounded-md font-medium"
        >
          Add Floor
        </button>
      </ActionForm>


      <div className="space-y-8">
        {floors.map((floor) => (
          <div
            key={floor.id}
            className="border border-neutral-800 rounded-lg p-5"
          >

          <ActionForm
  action={updateFloorName.bind(null, floor.id)}

              className="flex gap-2 mb-3 flex-wrap"
            >
              <input
                name="name"
                defaultValue={floor.name}
                className="px-2 py-1 rounded-md bg-neutral-900 border border-neutral-700 text-white text-sm w-40"
              />

              <input
                name="nameAm"
                defaultValue={floor.nameAm ?? ""}
                placeholder="ስም (አማርኛ)"
                className="px-2 py-1 rounded-md bg-neutral-900 border border-neutral-700 text-white text-sm w-40"
              />

              <button
                type="submit"
                className="px-3 py-1 bg-neutral-800 text-white rounded-md text-xs hover:bg-neutral-700"
              >
                Save Name
              </button>

            </ActionForm>


            <div className="flex justify-between items-center mb-4">

              <h2 className="text-lg font-medium">
                {floor.name}
              </h2>


             <ActionForm
  action={deleteFloor.bind(null, floor.id)}
>
                <button
                  type="submit"
                  className="text-red-400 text-sm hover:text-red-300"
                >
                  Delete Floor
                </button>
              </ActionForm>

            </div>



            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">

              {floor.tables.map((table) => (

                <div
                  key={table.id}
                  className={`border rounded-md p-3 text-sm ${
                    table.isEnabled
                      ? "border-neutral-700"
                      : "border-neutral-800 opacity-50"
                  }`}
                >

                  <p className="font-medium">
                    Table {table.number}
                  </p>

                  <p className="text-neutral-400">
                    Capacity: {table.capacity}
                  </p>


                  <div className="flex gap-2 mt-2">


                    <ActionForm
  action={toggleTableEnabled.bind(
    null,
    table.id,
    !table.isEnabled
  )}
>

                      <button
                        type="submit"
                        className="text-xs text-neutral-300 hover:text-white"
                      >
                        {table.isEnabled ? "Disable" : "Enable"}
                      </button>

                    </ActionForm>



   <ActionForm
  action={deleteTable.bind(null, table.id)}
>
                      <button
                        type="submit"
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>

                    </ActionForm>


                  </div>

                </div>

              ))}

            </div>



            <ActionForm
              action={createTable}
              className="flex gap-2 items-end"
            >

              <input
                type="hidden"
                name="floorId"
                value={floor.id}
              />


              <div>

                <label className="block text-xs text-neutral-400 mb-1">
                  Table #
                </label>

                <input
                  name="number"
                  className="px-2 py-1 rounded-md bg-neutral-900 border border-neutral-700 text-white text-sm w-20"
                  required
                />

              </div>



              <div>

                <label className="block text-xs text-neutral-400 mb-1">
                  Capacity
                </label>

                <input
                  name="capacity"
                  type="number"
                  defaultValue={4}
                  className="px-2 py-1 rounded-md bg-neutral-900 border border-neutral-700 text-white text-sm w-20"
                  required
                />

              </div>



              <button
                type="submit"
                className="px-3 py-1.5 bg-neutral-800 text-white rounded-md text-sm hover:bg-neutral-700"
              >
                Add Table
              </button>


            </ActionForm>


          </div>
        ))}
      </div>

    </div>
  );
}