import { useEffect, useState } from "react";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";

const ProjectTwo = () => {
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  //   const url = "https://jsonplaceholder.typicode.com/photos";
  const url = "https://picsum.photos/v2/list?page=1&limit=10";

  const fetchImages = async (url) => {
    try {
      setLoading(true);
      const resp = await fetch(url);
      const respJSON = await resp.json();
      if (respJSON) {
        setImages(respJSON);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setErrorMsg(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url !== "") fetchImages(url);
  }, [url]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMsg) {
    return <div>Some Error Occured.</div>;
  }

  return (
    <>
      <h1>Learning making slider</h1>
      <div>
        <CiCircleChevLeft />
        <div className="">
          {images.map((item) => {
            return (
              <>
                <img src={item.download_url} alt="slide-images" key={item.id} />
              </>
            );
          })}
        </div>
        <div className="inline">
          {images.map((i) => (
            <div className="w-2 h-2 bg-amber-50 rounded-full" key={i.id}></div>
          ))}
        </div>
        <CiCircleChevRight />
      </div>
    </>
  );
};

export default ProjectTwo;
