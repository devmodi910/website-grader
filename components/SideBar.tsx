import CircleProgress from "./CircleProgress";
export default function SideBar({ data }: { data: number }) {
    return (
      <div
        className="w-full md:w-1/2 bg-[#2d3e50] text-white p-6 flex flex-col 
        md:sticky md:top-0 md:h-screen md:max-h-screen md:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700"
      >
        <div className="flex justify-center mb-4">
          <CircleProgress score={data} />
        </div>
  
        <div className="text-xs text-center text-gray-300 mb-6">
          www.youtube.com
        </div>
  
        {/* Scores */}
        <div className="space-y-5 mt-2">
          {[
            {
              label: "PERFORMANCE",
              score: "15/30",
              width: "w-1/2",
              color: "#00bda5", // HEX color
            },
            {
              label: "SEO",
              score: "30/30",
              width: "w-full",
              color: "#00bda5",
            },
            {
              label: "MOBILE",
              score: "30/30",
              width: "w-full",
              color: "#00bda5",
            },
            {
              label: "SECURITY",
              score: "10/10",
              width: "w-full",
              color: "#00bda5",
            },
          ].map(({ label, score, width, color }, index) => (
            <div key={index}>
              <div className="flex justify-between text-[14px] font-semibold mb-1">
                <span>{label}</span> <span>{score}</span>
              </div>
              <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${width}`}
                  style={{ backgroundColor: color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
  
        {/* Promotional Section */}
        <div className="mt-10">
          <h2 className="text-[20px] font-semibold mb-3">
            Is your website slowing you down?
          </h2>
          <p className="text-sm text-white mb-5">
            Create and manage beautiful website pages that get traffic and
            convert leads with HubSpot CMS Free.
          </p>
          <button className="w-full bg-white text-gray-800 py-2 font-medium rounded hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
            Get the Free CMS
          </button>
          <p className="text-xs text-center text-white mt-2">
            No credit card needed
          </p>
        </div>
      </div>
    );
  }
  