import Image from "next/image";
export default function ImageStatus({ data }: { data: boolean | number }) {
  return (
    <div className="relative h-15 w-13 mx-auto my-5">
      {data ? (
        <Image src={"/images/pass.webp"} fill alt="xyz"></Image>
      ) : (
        <Image src={"/images/icon-fail-large.webp"} fill alt="xyz"></Image>
      )}
    </div>
  );
}
