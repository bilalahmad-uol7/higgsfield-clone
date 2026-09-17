import Image from "next/image";
import { SUPERCOMPUTER_SECTION } from "@/data/landing";
import { mediaUrl } from "@/lib/media";
import { Button } from "@/components/ui/Button";

export function SupercomputerCta() {
  return (
    <section className="mx-auto mt-14 mb-6 max-w-[1400px] px-4 md:px-6">
      <div className="relative overflow-hidden rounded-2xl border border-white-8 bg-surface-primary">
        <div className="absolute inset-0">
          <Image
            src={mediaUrl(SUPERCOMPUTER_SECTION.bg)}
            alt=""
            fill
            className="object-cover opacity-40"
            sizes="100vw"
          />
        </div>
        <div className="relative flex flex-col items-center gap-4 px-6 py-16 text-center sm:py-20">
          <Image src={mediaUrl(SUPERCOMPUTER_SECTION.logo)} alt="" width={40} height={40} />
          <h2 className="hf-heading text-2xl font-medium sm:text-4xl">{SUPERCOMPUTER_SECTION.title}</h2>
          <p className="max-w-lg text-sm text-white-60 sm:text-base">{SUPERCOMPUTER_SECTION.description}</p>
          <Button href="/supercomputer" variant="lime" size="lg" className="mt-2">
            {SUPERCOMPUTER_SECTION.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
