import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { scrollToZero } from "../../utility/ScrollToZero";
import { getProductById, isServerOnline } from "../../api/API";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Page from "../RenderPage";
import React from 'react';
import Reviews from "./components/Reviews";
import ProductImages from "./components/Images";
import ProductDescription from "./components/Description";
import ProductSizeSelector from "./components/SizeSelector";
import ProductGender from "./components/Gender";
import ProductActions from "./components/Actions";

function ProductPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState(true);
  const [data, setData] = useState();
  const [pictureIndex, setPictureIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(0);

  const UI_backButton = () => (
    <div className="mb-4 mt-1">
            <button 
              onClick={() => navigate(-1)} 
              className="transition ease-in-out duration-300 flex hover:-translate-x-2 items-center font-medium text-l"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
              <p>Kembali</p>
            </button>
          </div>
  )

  const renderContent = () => {
    return (
      <div className="py-5 h-screen font-inter text-gray-800">
        <div className="my-10 container mx-auto p-8 lg:w-10/12">
          <UI_backButton/>
          <div className="lg:grid lg:grid-cols-2 lg:items-start my-10">
            <ProductImages images={data.product.list_picture} imageIndex={pictureIndex} callback={setPictureIndex} />
            <div>
              <ProductDescription product={data.product} brand={data.brand}/>
              <ProductGender gender={data.product.sex} />
              <ProductSizeSelector currentIndex={sizeIndex} data={data.product.list_size} callback={setSizeIndex} />
              <ProductActions/>
            </div>
          </div>
          <Reviews/>
        </div>
      </div>
    )
  }
  
  useEffect(() => {
    const getContent = async() => {
      try {
        setLoading(true);
        if (!(await isServerOnline())) return setServerStatus(false);
        const res = await getProductById(params.id);
        setData(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    scrollToZero();
    getContent();
  }, [params.id]);

  return Page(loading, serverStatus, renderContent, true, false)
}

export default ProductPage