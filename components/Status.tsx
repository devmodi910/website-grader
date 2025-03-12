export default function Status({ data }: { data: boolean | number }) {
  return (
    <div className="text-[10px] font-medium relative leading-[14px] text-white">
      {data ? (
        <div className="bg-[#00bda5] absolute top-[-26px] right-[-35px] h-[20px] py-1 pr-2 pl-3 ml-auto uppercase rounded-[20px_3px_3px_20px]">
          Pass
        </div>
      ) : (
        <div className="bg-red-400 absolute top-[-26px] right-[-35px] h-[20px] py-1 pr-2 pl-3 ml-auto uppercase rounded-[20px_3px_3px_20px]">
          Fail
        </div>
      )}
    </div>
  );
}
