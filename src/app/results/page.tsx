"use client";

import { useLighthouse } from "../../../context/LightHouseContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageStatus from "../../../components/ImageStatus";
import Image from "next/image";
import CircleSmall from "../../../components/CircleSmall";
import Button from "../../../components/Button";
import SideBar from "../../../components/SideBar";
import CircleProgress from "../../../components/CircleProgress";
import Status from "../../../components/Status";

export default function ResultsPage() {
  const { data } = useLighthouse();
  const router = useRouter();
  const cacheQualtiy: boolean =
    data?.cachingAudit !== undefined && data.cachingAudit >= 0.5;
  const redirectQualtiy: boolean =
    data?.redirectsAudit !== undefined && data.redirectsAudit >= 0.5;
  const ImageQualtiy: boolean =
    data?.ImageSizeAudit !== undefined && data.ImageSizeAudit >= 0.5;
  const JSQualtiy: boolean =
    data?.minJSAudit !== undefined && data.minJSAudit >= 0.8;
  const CSSQualtiy: boolean = data?.minCSS !== undefined && data.minCSS >= 0.8;
  const TextQuality: boolean =
    data?.linkTextAudit !== undefined && data.linkTextAudit >= 0.5;
    const SecureJS: boolean =
    data?.secureLibAudit === null || data?.secureLibAudit === 1;

    let mainPerformanceScore: number = [
      (data?.pageSizeScore ?? 0) * 6 / 100,
      (data?.networkPerformance ?? 0) * 7 / 100,
      (data?.speedPerformance ?? 0) * 7 / 100,
      cacheQualtiy ? 2 : 0,
      redirectQualtiy ? 2 : 0,
      ImageQualtiy ? 2 : 0,
      JSQualtiy ? 2 : 0,
      CSSQualtiy ? 2 : 0
    ].reduce((sum, value) => sum + value, 0);
  
    let mainSEOScore:number = [
      data?.perm_to_index ? 7 : 0,
      data?.metaDescriptionAudit === 1 ? 7 : 0,
      TextQuality ? 8 : 0,
      data?.pluginsAudit ===1 ? 8 : 0
    ].reduce((sum,value) => sum + value,0);
  
    let mainMobileScore:number = [
      data?.legibleFontSize === 1 ? 10 : 0,
      data?.metaDescriptionAudit === 1 ? 10 : 0,
      data?.responsiveCheck === 1 ? 10 : 0
    ].reduce((sum,value) => sum + value,0);
  
    let mainSecurityScore:number = [
      data?.httpAudit === 1 ? 5 : 0,
      SecureJS ? 5 : 0
    ].reduce((sum,value) => sum + value,0)
  
    let mainScore:number = (mainSecurityScore + mainMobileScore + mainSEOScore + mainPerformanceScore);

    let result:string = mainScore > 75 ? "great" : (mainScore > 50 ? "good" : "bad");

  useEffect(() => {
    if (!data) {
      router.push("/");
    }
  }, [data, router]);

  if (!data) return null;

  return (
    <div
      id="main"
      className="relative flex flex-col md:flex-row h-screen overflow-y-auto font-sans"
    >
      {/* Sidebar */}
      <SideBar data={Math.floor(mainScore)} />

      {/* Main Content */}
      <div className="bg-[#f5f8fa] h-full -z-20">
        <div className="flex-1 min-h-screen relative">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6a78d1] to-[#00a4bd] h-[600px] -z-10"></div>

          {/* Main Content Section */}
          <div className="hidden lg:block">
            <div className="flex justify-between p-4">
              <div className="flex items-center">
                <Image
                  src="/images/hubspot-tools-logo.webp"
                  alt="HubSpot Logo"
                  width={150}
                  height={40}
                />
                <div className="ml-2 text-xs text-white">WEBSITE GRADER</div>
              </div>
              <div className="rounded-full px-3 py-1 flex items-center space-x-1 cursor-pointer transition-colors duration-200">
                <Button />
              </div>
            </div>
            <div className="max-w-2xl mx-auto text-white mb-4 flex flex-col mt-20">
              <h1 className="text-5xl text-center font-bold mb-3">
                This site is {result}
              </h1>
              <p className="text-[14px] leading-6">
                You're amazing! Let's all bask in the glow of your amazingness.
                Ahhh. See your scorecard below and take action now by creating a
                high-speed website with HubSpot CMS Free.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center mt-6">
              <button className="bg-gray-800 hover:bg-gray-700 text-white py-3 px-5 rounded font-medium transition-colors duration-200">
                Create a high-speed website
              </button>
            </div>

            {/* Image Section */}
            <div className="flex mt-[20px] justify-center -z-30">
              {/* <embed type="image/jpg" src={data.screenshotBase64} width="300" height="200"/> */}
              <Image
                className="text-[14px] font-['Lexend_Deca','Helvetica','Arial',sans-serif]
              text-center text-white box-border border-0 bg-[#f5f8fa] h-[300px] w-[500px] md:h-[400px] md:w-[760px] max-w-full rounded-b-lg shadow-lg "
                src={data.screenshotBase64}
                priority
                width={1000}
                height={1000}
                alt={`Screenshot of ${data.url}`}
              />
            </div>
          </div>
          <div className="bg-[#f5f8fa] flex flex-col justify-center text-center font-black">
            <div className="h-full align-middle">
              <div className="mb-15">
                <div className="flex justify-center mt-15 mb-3 text-center">
                  <div className="flex justify-center items-center w-38 object-contain ">
                    <Image
                      src={"/images/performance.png"}
                      width={200}
                      height={200}
                      alt="xyz"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <div className="text-5xl font-bold">
                    <span className="text-[#00bda5]">{Math.floor(mainPerformanceScore)}</span>
                    <span className="text-[#33475b] text-3xl">/30</span>
                  </div>
                  <div className="mb-[10px] inline-block relative w-60">
                    <div className="bg-[#dbdbdb] h-[10px] rounded-full overflow-hidden">
                      <div className="w-full bg-[#00bda5] h-full"></div>
                    </div>
                  </div>
                </div>
                <h3 className="text-[#333] text-[32px] font-bold">
                  Performance
                </h3>
                <div className="text-[#33475b] text-[16px] font-normal text-center leading-6 relative m-auto w-4/5 max-w-[690px]">
                  Optimizing your website's performance is crucial to increasing
                  traffic, improving conversion rates, generating more leads,
                  and increasing revenue.
                </div>
                <div className="flex justify-center">
                  <div className="border border-[#dfe3eb] rounded-[40px] bg-white my-[10px] px-5 py-[12px] flex items-center justify-center w-[460px]">
                    {/* Trophy Icon */}
                    <div className="bg-[url('/images/icon-trophy.webp')] bg-center bg-no-repeat bg-[length:24px_21px] w-6 h-6 mr-3"></div>

                    {/* Text */}
                    <div className="text-[#516f90] text-xs leading-3 font-light flex">
                      Improve your website performance with&nbsp;
                      <span className="text-[#0073aa] font-bold">
                        free 15-minute lesson
                      </span>
                    </div>
                  </div>
                </div>
                <div className="font-sans flex flex-col md:flex-row justify-around">
                  {/* Box 1 */}
                  <div className="flex-1 bg-white border-r border-[#dbdbdb] last:border-r-0 p-4 m-[30px] pt-9 px-[30px] pb-[30px] shadow-md">
                    <div className="text-[14px] leading-[19px] text-[#4a4a4a] mb-5 uppercase break-words">
                      Page size
                    </div>
                    <div>
                      <CircleSmall score={data.pageSizeScore} />
                      <div className=" flex text-[#2d3e50] relative text-[32px] font-medium h-[40px] uppercase justify-center">
                        {data.pageSizeReturn}
                        {/* <span className="text-[14px] uppercase">MB</span> */}
                      </div>
                    </div>
                    <div>
                      {data.pageSizeKB < 3000 ?
                        (<div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          So fast! So light!
                        </div>) : (<div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          So fast! So light!
                        </div>)
                      }
                      <div className="text-[#516f90] text-[14px] leading-[20px] my-[10px]">
                        The heavier the site page, the slower the load. For
                        optimal performance, try to keep page size below 3MB.
                      </div>
                    </div>
                  </div>

                  {/* Box 2 */}
                  <div className="flex-1 bg-white border-r border-[#dbdbdb] last:border-r-0 p-4 m-[30px] pt-9 px-[30px] pb-[30px] shadow-md">
                    <div className="text-[14px] leading-[19px] text-[#4a4a4a] mb-5 uppercase break-words">
                      Page Requests
                    </div>
                    <CircleSmall score={data.networkPerformance} />
                    <div className="flex text-[#2d3e50] relative text-[32px] font-medium h-[40px] uppercase justify-center">
                      {data.numberOfPageRequests}
                      {/* <span className="text-[14px] uppercase">MB</span> */}
                    </div>
                    <div>
                      {data.numberOfPageRequests <= 30 ? (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          You make this look easy.
                        </div>
                      ) : data.numberOfPageRequests <= 60 ? (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Serious room for improvment.
                        </div>
                      ) : (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          You make this look easy.
                        </div>
                      )}
                      <div className="text-[#516f90] text-[14px] leading-[20px] my-[10px]">
                        The more HTTP requests your website makes, the slower it
                        becomes. Try reducing the number of files your site
                        loads.
                      </div>
                    </div>
                  </div>

                  {/* Box 3 (Now Equal in Size) */}
                  <div className="flex-1 flex flex-col items-center justify-center bg-white border-r border-[#dbdbdb] last:border-r-0 p-4 m-[30px] pt-9 px-[30px] pb-[30px] shadow-md">
                    <div className="text-[14px] leading-[19px] text-[#4a4a4a] mb-5 uppercase break-words text-center">
                      Page Speed
                    </div>
                    <CircleSmall score={data.speedPerformance} />
                    <div className=" flex text-[#2d3e50] relative text-[32px] font-medium h-[40px] uppercase justify-center">
                      {(Number(data.totalLoadTime) / 1000).toFixed(2)}

                      <span className="text-[10px] flex justify-center">
                        sec
                      </span>
                    </div>
                    {Number(data.totalLoadTime) / 1000 <= 5.3 ? (
                      <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                        You make this look easy.
                      </div>
                    ) : Number(data.totalLoadTime) / 1000 <= 14 ? (
                      <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                        Serious room for improvment.
                      </div>
                    ) : (
                      <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                        Not good.
                      </div>
                    )}
                    <div className="text-[#516f90] text-[14px] leading-[20px] my-[10px] text-center">
                      Best-in-class webpages should become interactive within
                      5.3 seconds. Any slower and visitors will abandon your
                      site, reducing conversions and sales.
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row justify-around font-serif">
                  {/* Box 1 */}
                  <div className="flex-1 bg-white border-r border-[#dbdbdb] last:border-r-0 p-4 m-[30px] pt-9 px-[30px] pb-[30px] shadow-md">
                    <Status data={cacheQualtiy} />
                    <div className="text-[14px] leading-[19px] text-[#4a4a4a] mb-5 uppercase break-words">
                      Browser Caching
                    </div>
                    <ImageStatus data={cacheQualtiy} />
                    <div>
                      {cacheQualtiy ? (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Wowee. Your web caching is world class.
                        </div>
                      ) : (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Need for improvement
                        </div>
                      )}
                      <div className="text-[#516f90] text-[14px] leading-[20px] my-[10px]">
                        Browser caching speeds up your website by storing
                        frequently used content in local memory.
                      </div>
                    </div>
                  </div>

                  {/* Box 2 */}
                  <div className="flex-1 bg-white border-r border-[#dbdbdb] last:border-r-0 p-4 m-[30px] pt-9 px-[30px] pb-[30px] shadow-md">
                    <Status data={redirectQualtiy} />
                    <div className="text-[14px] leading-[19px] text-[#4a4a4a] mb-5 uppercase break-words">
                      Minimal Page Redirects
                    </div>
                    <ImageStatus data={redirectQualtiy} />
                    <div>
                      {redirectQualtiy ? (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Straight to the point.
                        </div>
                      ) : (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Need for improvement
                        </div>
                      )}
                      <div className="text-[#516f90] text-[14px] leading-[20px] my-[10px]">
                        Multiple redirects can make your site load slower. Aim
                        for no more than one redirect.
                      </div>
                    </div>
                  </div>

                  {/* Box 3 (Now Equal in Size) */}
                  <div className="flex-1 bg-white border-r border-[#dbdbdb] last:border-r-0 p-4 m-[30px] pt-9 px-[30px] pb-[30px] shadow-md">
                    <Status data={ImageQualtiy} />
                    <div className="text-[14px] leading-[19px] text-[#4a4a4a] mb-5 uppercase break-words">
                      Image Size
                    </div>
                    <ImageStatus data={ImageQualtiy} />
                    <div>
                      {ImageQualtiy ? (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          They fit perfectly!
                        </div>
                      ) : (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Need for improvement
                        </div>
                      )}
                      <div className="text-[#516f90] text-[14px] leading-[20px] my-[10px]">
                        Images can take a long time to load. Use responsive
                        images or SVGs to optimize your images for different
                        screen sizes.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row mx-auto max-w-[700px] font-serif">
                  <div className="flex-1 bg-white m-[30px] px-[30px] pt-[36px] pb-[30px] shadow-md">
                    <div className="text-[10px] font-medium relative leading-[14px] text-white">
                      <Status data={JSQualtiy} />
                    </div>
                    <div className="text-[14px] leading-[19px] text-[#4a4a4a] mb-5 uppercase break-words">
                      Minified Javascript
                    </div>
                    <ImageStatus data={JSQualtiy} />
                    <div>
                      {JSQualtiy ? (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Have you been working out?
                        </div>
                      ) : (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Need for improvement
                        </div>
                      )}
                      <div className="text-[#516f90] text-[14px] leading-[20px] my-[10px]">
                        When your JavaScript is properly compressed, it makes
                        your website run much faster.
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 bg-white m-[30px] px-[30px] pt-[36px] pb-[30px] shadow-md">
                    <Status data={CSSQualtiy} />
                    <div className="text-[14px] leading-[19px] text-[#4a4a4a] mb-5 uppercase break-words">
                      Minified CSS
                    </div>
                    <ImageStatus data={CSSQualtiy} />
                    <div>
                      {CSSQualtiy ? (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Short and sweet
                        </div>
                      ) : (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Need for improvement
                        </div>
                      )}
                      <div className="text-[#516f90] text-[14px] leading-[20px] my-[10px]">
                        When your CSS is properly compressed, it makes your
                        website run much faster.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#f5f8fa] flex flex-col justify-center text-center font-black">
            <div className="h-full align-middle">
              <div className="mb-15">
                <div className="flex justify-center mt-15 mb-3 text-center">
                  <div className="flex justify-center items-center w-38 object-contain">
                    <Image
                      className="bg-[#f5f8fa]"
                      src={"/images/SEO.webp"}
                      width={200}
                      height={200}
                      alt="xyz"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <div className="text-5xl font-bold">
                    <span className="text-[#00bda5]">{mainSEOScore}</span>
                    <span className="text-[#33475b] text-3xl">/30</span>
                  </div>
                  <div className="mb-[10px] inline-block relative w-60">
                    <div className="bg-[#dbdbdb] h-[10px] rounded-full overflow-hidden">
                      <div className="w-full bg-[#00bda5] h-full"></div>
                    </div>
                  </div>
                </div>
                <h3 className="text-[#333] text-[32px] font-bold">SEO</h3>
                <div className="text-[#33475b] text-[16px] font-normal text-center leading-6 relative m-auto w-4/5 max-w-[690px] space-x-0">
                  Optimizing your website content for search helps you drive
                  organic traffic to your website. You can do this by providing
                  a great experience for people and web crawlers alike.
                </div>
                <div className="flex justify-center">
                  <div className="border border-[#dfe3eb] rounded-[40px] bg-white my-[10px] px-5 py-[12px] flex items-center justify-center w-[460px]">
                    {/* Trophy Icon */}
                    <div className="bg-[url('/images/search.webp')] bg-center bg-no-repeat bg-[length:24px_21px] w-6 h-6 mr-3"></div>

                    {/* Text */}
                    <div className="text-[#516f90] text-xs leading-3 font-light flex">
                      Improve your website performance with&nbsp;
                      <span className="text-[#0073aa] font-bold">
                        free 15-minute lesson
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row justify-around font-serif">
                  {/* Box 1 */}
                  <div className="flex-1 bg-white border-r border-[#dbdbdb] last:border-r-0 p-4 m-[30px] pt-9 px-[30px] pb-[30px] shadow-md">
                    <Status data={data.perm_to_index} />
                    <div className="text-[14px] leading-[19px] text-[#4a4a4a] mb-5 uppercase break-words">
                      Permission To Index
                    </div>
                    <ImageStatus data={data.perm_to_index} />
                    <div>
                      {data.perm_to_index ? (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Granted
                        </div>
                      ) : (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Need for improvement
                        </div>
                      )}
                      <div className="text-[#516f90] text-[14px] leading-[20px] my-[10px]">
                        In order for a page to appear in search results, search
                        engines must have permission to store it in their index.
                        If they can't store it, no other changes matter.
                      </div>
                    </div>
                  </div>

                  {/* Box 2 */}
                  <div className="flex-1 bg-white border-r border-[#dbdbdb] last:border-r-0 p-4 m-[30px] pt-9 px-[30px] pb-[30px] shadow-md">
                    <Status data={data.metaDescriptionAudit} />
                    <div className="text-[14px] leading-[19px] text-[#4a4a4a] mb-5 uppercase break-words">
                      Meta Description
                    </div>
                    <ImageStatus data={data.metaDescriptionAudit} />
                    <div>
                      {data.metaDescriptionAudit ? (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Look at you go!
                        </div>
                      ) : (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Need for improvement
                        </div>
                      )}
                      <div className="text-[#516f90] text-[14px] leading-[20px] my-[10px]">
                        Meta descriptions tell people what your page is about in
                        search results.
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 bg-white border-r border-[#dbdbdb] last:border-r-0 p-4 m-[30px] pt-9 px-[30px] pb-[30px] shadow-md">
                    <Status data={data.pluginsAudit} />
                    <div className="text-[14px] leading-[19px] text-[#4a4a4a] mb-5 uppercase break-words">
                      Content Plugins
                    </div>
                    <ImageStatus data={data.pluginsAudit} />
                    <div>
                      {data.pluginsAudit != null &&
                      typeof data.pluginsAudit === "number" &&
                      !isNaN(data.pluginsAudit) &&
                      data.pluginsAudit >= 0.5 ? (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          *Clap, clap, clap* Good job!
                        </div>
                      ) : (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Need for improvement
                        </div>
                      )}

                      <div className="text-[#516f90] text-[14px] leading-[20px] my-[10px]">
                        Search engines can't always understand content that
                        relies on browser plugins, such as Flash.
                      </div>
                    </div>
                  </div>

                  {/* Box 3 (Now Equal in Size) */}
                  <div className="flex-1 bg-white border-r border-[#dbdbdb] last:border-r-0 p-4 m-[30px] pt-9 px-[30px] pb-[30px] shadow-md">
                  <Status data={data.metaDescriptionAudit} />
                    <div className="text-[14px] leading-[19px] text-[#4a4a4a] mb-5 uppercase break-words">
                      Descriptive Link Text
                    </div>
                    <ImageStatus data={data.metaDescriptionAudit} />
                    <div>
                      {data.metaDescriptionAudit ? (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Your links make sense.
                        </div>
                      ) : (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Need for improvement
                        </div>
                      )}
                      <div className="text-[#516f90] text-[14px] leading-[20px] my-[10px]">
                        Descriptive link text helps visitors know what they'll
                        see if they click the link. "Click here" doesn't cut it.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#f5f8fa] flex flex-col justify-around text-center font-black">
            <div className="h-full align-middle">
              <div className="mb-15">
                <div className="flex justify-center mt-15 mb-3 text-center">
                  <div className="flex justify-center items-center w-38 object-contain ">
                    <Image
                      src={"/images/mobile.png"}
                      width={200}
                      height={200}
                      alt="xyz"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <div className="text-5xl font-bold">
                    <span className="text-[#00bda5]">{mainMobileScore}</span>
                    <span className="text-[#33475b] text-3xl">/30</span>
                  </div>
                  <div className="mb-[10px] inline-block relative w-60">
                    <div className="bg-[#dbdbdb] h-[10px] rounded-full overflow-hidden">
                      <div className="w-full bg-[#00bda5] h-full"></div>
                    </div>
                  </div>
                </div>
                <h3 className="text-[#333] text-[32px] font-bold">Mobile</h3>
                <div className="text-[#33475b] text-[16px] font-normal text-center leading-6 relative m-auto w-4/5 max-w-[690px] space-x-0">
                  Traffic from mobile devices is growing fast. Optimize your
                  website for mobile or you'll miss out on valuable traffic,
                  leads, and revenue.
                </div>
                <div className="flex justify-center">
                  <div className="border border-[#dfe3eb] rounded-[40px] bg-white my-[10px] px-5 py-[12px] flex items-center justify-center w-[460px]">
                    {/* Trophy Icon */}
                    <div className="bg-[url('/images/icon-mobile.webp')] bg-center bg-no-repeat bg-[length:24px_21px] w-4 h-6 mr-3"></div>

                    {/* Text */}
                    <div className="text-[#516f90] text-xs leading-3 font-light flex">
                      Improve your website performance with&nbsp;
                      <span className="text-[#0073aa] font-bold">
                        free 15-minute lesson
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row justify-around font-serif items-center md:items-start h-full min-h-[400px]">
                  {/* Box 1 */}
                  <div className="ml-[30px] top-[30px] mb-[20px] mr-[20px] inline-block relative h-full">
                    {/* Screenshot inside the iPhone Frame */}
                    <div className="w-[218px] h-[360px] overflow-hidden relative">
                      {data.mobileScreenshot ? (
                        <Image
                          className="rounded-[12%]"
                          src={data.mobileScreenshot}
                          fill
                          alt="Website Screenshot"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-600">
                          No Screenshot
                        </div>
                      )}
                    </div>

                    {/* iPhone Frame Overlay */}
                    <div className="absolute inset-0 w-[218px] h-[360px] pointer-events-none">
                      <Image
                        src={"/images/iphone-frame.webp"}
                        alt="iPhone Frame"
                        fill
                      />
                    </div>
                  </div>

                  {/* Box 2 */}
                  <div className="flex-1 bg-white border-r border-[#dbdbdb] last:border-r-0 p-4 m-[30px] pt-9 px-[30px] pb-[30px] shadow-md h-full">
                    <Status data={data.legibleFontSize} />
                    <div className="text-[14px] leading-[19px] text-[#4a4a4a] mb-5 uppercase break-words">
                      Legible Font Size
                    </div>
                    <ImageStatus data={data.legibleFontSize} />
                    <div>
                      {data.legibleFontSize ? (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Easy on the eyes.
                        </div>
                      ) : (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Need for improvement
                        </div>
                      )}
                      <div className="text-[#516f90] text-[14px] leading-[20px] my-[10px]">
                        Visitors may have difficulty reading small text,
                        especially on mobile devices. We recommend at least
                        12px.
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 bg-white border-r border-[#dbdbdb] last:border-r-0 p-4 m-[30px] pt-9 px-[30px] pb-[30px] shadow-md h-full">
                    <div className="text-[10px] font-medium relative leading-[14px] text-white">
                      <div className="bg-[#00bda5] absolute top-[-26px] right-[-35px] h-[20px] py-1 pr-2 pl-3 ml-auto uppercase rounded-[20px_3px_3px_20px]">
                        Pass
                      </div>
                    </div>
                    <div className="text-[14px] leading-[19px] text-[#4a4a4a] mb-5 uppercase break-words">
                      Tap Targets
                    </div>
                    <div className="relative h-15 w-13 mx-auto my-5">
                      <Image src={"/images/pass.webp"} fill alt="xyz"></Image>
                    </div>
                    <div>
                      {data.legibleFontSize ? (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Easy on the eyes.
                        </div>
                      ) : (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Need for improvement
                        </div>
                      )}
                      <div className="text-[#516f90] text-[14px] leading-[20px] my-[10px]">
                        Mobile-friendly pages perform better in search results.
                        Make sure interactive elements like buttons and links
                        are not too small or too close together.
                      </div>
                    </div>
                  </div>

                  {/* Box 3 (Now Equal in Size) */}
                  <div className="flex-1 bg-white border-r border-[#dbdbdb] last:border-r-0 p-4 m-[30px] pt-9 px-[30px] pb-[30px] shadow-md">
                    <Status data={data.responsiveCheck} />
                    <div className="text-[14px] leading-[19px] text-[#4a4a4a] mb-5 uppercase break-words">
                      Responsive
                    </div>
                    <ImageStatus data={data.responsiveCheck} />
                    <div>
                      {data.responsiveCheck ? (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Fantastic! You're ready to face the future.
                        </div>
                      ) : (
                        <div className="leading-[21px] font-bold text-[14px] my-auto mx-[10px]">
                          Need for improvement
                        </div>
                      )}
                      <div className="text-[#516f90] text-[14px] leading-[20px] my-[10px]">
                        Responsive design gives you a bump in search rankings
                        for searches on mobile devices.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#f5f8fa] flex flex-col justify-center text-center font-black">
            <div className="h-full align-middle">
              <div className="mb-15">
                <div className="flex justify-center mt-15 mb-3 text-center">
                  <div className="flex justify-center items-center w-38 object-contain ">
                    <Image
                      src={"/images/security.webp"}
                      width={200}
                      height={200}
                      alt="xyz"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <div className="text-5xl font-bold">
                    <span className="text-[#00bda5]">{mainSecurityScore}</span>
                    <span className="text-[#33475b] text-3xl">/10</span>
                  </div>
                  <div className="mb-[10px] inline-block relative w-60">
                    <div className="bg-[#dbdbdb] h-[10px] rounded-full overflow-hidden">
                      <div className="w-full bg-[#00bda5] h-full"></div>
                    </div>
                  </div>
                </div>
                <h3 className="text-[#333] text-[32px] font-bold">Security</h3>
                <div className="text-[#33475b] text-[16px] font-normal text-center leading-6 relative m-auto w-4/5 max-w-[690px] space-x-0">
                  A secure website equipped with an SSL certificate and free
                  from vulnerabilities is now the standard online. People and
                  search engines love secure websites.
                </div>
                <div className="flex justify-center">
                  <div className="border border-[#dfe3eb] rounded-[40px] bg-white my-[10px] px-5 py-[12px] flex items-center justify-center w-[460px]">
                    {/* Trophy Icon */}
                    <div className="bg-[url('/images/icon-lock.webp')] bg-center bg-no-repeat bg-[length:24px_21px] w-6 h-6 mr-3"></div>

                    {/* Text */}
                    <div className="text-[#516f90] text-xs leading-3 font-light flex">
                      Improve your Site Security with&nbsp;
                      <span className="text-[#0073aa] font-bold">
                        free 15-minute lesson
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-col lg:flex-row justify-center gap-5 font-sans w-full p-4">
                  {/* HTTPS Card */}
                  <div className="flex flex-col md:flex-row items-center justify-center text-left p-5 min-h-[250px] bg-white shadow-md w-full lg:w-[48%]">
                    <div className="flex items-center justify-center h-full w-full p-10 bg-gradient-to-br from-[#6a78d1] to-[#00a4bd]">
                      <div className="w-[86px] h-[86px]">
                        <Image
                          src={"/images/pass.webp"}
                          width={100}
                          height={100}
                          alt="xyz"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col justify-center p-4 h-full">
                      <div className="mb-2 text-[#4a4a4a] text-[14px] font-medium leading-[21px] uppercase break-words">
                        HTTPS
                      </div>
                      <div>
                        <div className="text-[14px] font-bold">Secured.</div>
                        <div className="text-[#516f90] text-[14px] leading-[20px] my-[10px] font-normal">
                          HTTPS protects websites from attacks and gives
                          visitors confidence that your site is authentic and
                          trustworthy.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secure JavaScript Libraries Card */}
                  <div className="flex flex-col md:flex-row items-center justify-center text-left p-5 min-h-[250px] bg-white shadow-md w-full lg:w-[48%]">
                    <div className="flex items-center justify-center h-full w-full p-10 bg-gradient-to-br from-[#6a78d1] to-[#00a4bd]">
                      <div className="w-[86px] h-[86px]">
                        <Image
                          src={"/images/icon-fail-large.webp"}
                          width={100}
                          height={100}
                          alt="xyz"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col justify-center p-4 h-full">
                      <div className="mb-2 text-[#4a4a4a] text-[14px] font-medium leading-[21px] uppercase break-words">
                        Secure JavaScript Libraries
                      </div>
                      <div>
                        <div className="text-[14px] font-bold">
                          I'm not feeling safe here.
                        </div>
                        <div className="text-[#516f90] text-[14px] leading-[20px] my-[10px] font-normal">
                          Intruders can exploit outdated JavaScript libraries.
                          Using the latest version of each library and updating
                          it regularly will help keep you safe.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="bg-[#f5f8fa] pb-[150px] text-center">
          <div>
            <div className="mx-auto max-w-[1160px]">
              <h3 className="text-[#333] mt-0 mb-[60px] text-[32px] font-bold leading-[44px]">What should I do next?
              </h3>
              <div className="pb-[10px]">
                <table className="font-medium text-[#33475b] leading-6 text-[14px] m-0 text-center bg-white border-collapse w-full border-[#dfe3eb] border-solid border-2 table">
                  <colgroup className="table-column-group">
                  <col className="w-[240x]"></col>
                  </colgroup>
                  <thead className="table-header-group align-middle border-inherit">
                    <tr className="table-row align-middle border-inherit">
                      <th className="table-cell text-[12px] bg-[#f5f8fa] text-[#33475b] h-[44px] text-left uppercase align-middle pt-2 pb-1 px-6">x</th>
                      <th className="table-cell text-[12px] bg-[#f5f8fa] text-[#33475b] h-[44px] text-left uppercase align-middle pt-2 pb-1 px-6">y</th>
                      <th className="table-cell text-[12px] bg-[#f5f8fa] text-[#33475b] h-[44px] text-left uppercase align-middle pt-2 pb-1 px-6">y</th>
                      <th className="table-cell text-[12px] bg-[#f5f8fa] text-[#33475b] h-[44px] text-left uppercase align-middle pt-2 pb-1 px-6">z</th>
                    </tr>
                  </thead>
                  <tbody className="table-row-group align-middle border-inherit">
                    <tr className="table-row align-middle border-inherit">
                      <td className="table-cell border-[#dfe3eb] border-solid h-18 py-4 px-6 align-middle break-words hyphens-auto">hii</td>
                      <td className="table-cell border-[#dfe3eb] border-solid h-18 py-4 px-6 align-middle break-words hyphens-auto">byee</td>
                      <td className="table-cell border-[#dfe3eb] border-solid h-18 py-4 px-6 align-middle break-words hyphens-auto">byee</td>
                      <td className="table-cell border-[#dfe3eb] border-solid h-18 py-4 px-6 align-middle break-words hyphens-auto">GN</td>
                    </tr>
                    <tr className="table-row align-middle border-inherit">
                      <td className="table-cell border-[#dfe3eb] border-solid h-18 py-4 px-6 align-middle break-words hyphens-auto">hii</td>
                      <td className="table-cell border-[#dfe3eb] border-solid h-18 py-4 px-6 align-middle break-words hyphens-auto">byee</td>
                      <td className="table-cell border-[#dfe3eb] border-solid h-18 py-4 px-6 align-middle break-words hyphens-auto">byee</td>
                      <td className="table-cell border-[#dfe3eb] border-solid h-18 py-4 px-6 align-middle break-words hyphens-auto">GN</td>
                    </tr>
                    <tr className="table-row align-middle border-inherit">
                      <td className="table-cell border-[#dfe3eb] border-solid h-18 py-4 px-6 align-middle break-words hyphens-auto">hii</td>
                      <td className="table-cell border-[#dfe3eb] border-solid h-18 py-4 px-6 align-middle break-words hyphens-auto">byee</td>
                      <td className="table-cell border-[#dfe3eb] border-solid h-18 py-4 px-6 align-middle break-words hyphens-auto">byee</td>
                      <td className="table-cell border-[#dfe3eb] border-solid h-18 py-4 px-6 align-middle break-words hyphens-auto">GN</td>
                    </tr>
                    <tr className="table-row align-middle border-inherit">
                      <td className="table-cell border-[#dfe3eb] border-solid h-18 py-4 px-6 align-middle break-words hyphens-auto">hii</td>
                      <td className="table-cell border-[#dfe3eb] border-solid h-18 py-4 px-6 align-middle break-words hyphens-auto">byee</td>
                      <td className="table-cell border-[#dfe3eb] border-solid h-18 py-4 px-6 align-middle break-words hyphens-auto">byee</td>
                      <td className="table-cell border-[#dfe3eb] border-solid h-18 py-4 px-6 align-middle break-words hyphens-auto">GN</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div> */}
        </div>
      </div>
    </div>
  );
}
