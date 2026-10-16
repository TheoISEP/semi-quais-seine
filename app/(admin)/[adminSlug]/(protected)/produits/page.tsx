import { db } from "@/lib/db";
import { formatEuros } from "@/lib/utils";
import { resolveAssetUrl } from "@/lib/assets";
import { deleteProduct, saveProduct } from "@/lib/actions/admin";
import { ActionForm, ConfirmButton, Field, SubmitButton, inputClass } from "@/components/admin/forms";

export const metadata = { title: "Produits" };

const typeLabel: Record<string, string> = {
  TSHIRT: "T-shirt",
  PHOTO_PACK: "Pack photos",
  OTHER: "Autre",
};

export default async function ProductsPage() {
  const edition = await db.edition.findFirst({
    orderBy: { year: "desc" },
    include: { products: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], include: { _count: { select: { orderItems: true } } } } },
  });
  if (!edition) return <p className="text-sm text-slate-500">Aucune édition : lance <code>npm run db:seed</code>.</p>;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Produits</h1>
        <p className="text-sm text-slate-500">
          Options proposées dans le tunnel d&rsquo;inscription : t-shirt (si activé dans l&rsquo;édition), packs photos, autres. La
          médaille est incluse dans le dossard et n&rsquo;a pas besoin d&rsquo;être ici.
        </p>
        {!edition.tshirtEnabled && (
          <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Les t-shirts sont désactivés dans les paramètres de l&rsquo;édition : un produit T-shirt ne sera pas proposé tant que
            l&rsquo;option n&rsquo;est pas cochée.
          </p>
        )}
      </div>

      {edition.products.length === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
          Aucun produit pour l&rsquo;instant.
        </p>
      )}

      {edition.products.map((p) => {
        const image = resolveAssetUrl(p.imageKey);
        return (
          <section key={p.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                    sans visuel
                  </div>
                )}
                <div>
                  <h2 className="text-base font-semibold">
                    {p.name}{" "}
                    <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-normal text-slate-600">{typeLabel[p.type]}</span>
                    {!p.active && <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-normal text-slate-500">inactif</span>}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {formatEuros(p.priceCents)} · {p._count.orderItems} vendu{p._count.orderItems > 1 ? "s" : ""}
                    {p.stock != null && ` · stock ${p.stock}`}
                  </p>
                </div>
              </div>
              <ConfirmButton action={deleteProduct.bind(null, p.id)} confirmLabel="Supprimer le produit ?">
                Supprimer
              </ConfirmButton>
            </div>
            <ProductForm editionId={edition.id} product={p} />
          </section>
        );
      })}

      <details className="rounded-2xl border border-dashed border-slate-300 bg-white p-5" open={edition.products.length === 0}>
        <summary className="cursor-pointer text-sm font-semibold text-slate-700">+ Ajouter un produit</summary>
        <div className="mt-4">
          <ProductForm editionId={edition.id} />
        </div>
      </details>
    </div>
  );
}

function ProductForm({
  editionId,
  product,
}: {
  editionId: string;
  product?: {
    id: string;
    type: string;
    name: string;
    description: string | null;
    priceCents: number;
    imageKey: string | null;
    sizes: string[];
    stock: number | null;
    sortOrder: number;
    active: boolean;
  };
}) {
  return (
    <ActionForm action={saveProduct} resetOnSuccess={!product}>
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="editionId" value={editionId} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Type">
          <select name="type" defaultValue={product?.type ?? "TSHIRT"} className={inputClass}>
            <option value="TSHIRT">T-shirt</option>
            <option value="PHOTO_PACK">Pack photos</option>
            <option value="OTHER">Autre</option>
          </select>
        </Field>
        <Field label="Nom">
          <input name="name" defaultValue={product?.name ?? ""} placeholder="T-shirt officiel 2027" required className={inputClass} />
        </Field>
        <Field label="Prix (€)">
          <input name="price" defaultValue={product ? (product.priceCents / 100).toFixed(2) : ""} placeholder="20" inputMode="decimal" className={inputClass} />
        </Field>
        <Field label="Tailles (t-shirt)" hint="Séparées par des virgules.">
          <input name="sizes" defaultValue={product?.sizes.join(", ") ?? "XS, S, M, L, XL, XXL"} className={inputClass} />
        </Field>
        <Field label="Stock" hint="Vide = illimité.">
          <input name="stock" type="number" min={0} defaultValue={product?.stock ?? ""} className={inputClass} />
        </Field>
        <Field label="Ordre d'affichage">
          <input name="sortOrder" type="number" defaultValue={product?.sortOrder ?? 0} className={inputClass} />
        </Field>
        <Field label="Visuel" hint="Clé S3 (médiathèque, phase 3), ou une URL complète, ou un chemin du site comme /images/tshirt.jpg." className="sm:col-span-2">
          <input name="imageKey" defaultValue={product?.imageKey ?? ""} className={inputClass} />
        </Field>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={product?.active ?? true} className="h-4 w-4 rounded border-slate-300" />
          Produit actif
        </label>
        <Field label="Description" className="sm:col-span-3">
          <textarea name="description" defaultValue={product?.description ?? ""} rows={2} className={inputClass} />
        </Field>
      </div>
      <SubmitButton variant={product ? "secondary" : "primary"}>{product ? "Enregistrer" : "Créer le produit"}</SubmitButton>
    </ActionForm>
  );
}
