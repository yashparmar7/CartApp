import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Navbar from "../../components/Navbar";
import Card from "../../components/Card";
import {
  getAllProducts,
  searchProducts,
} from "../../features/product/productSlice";

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const query = searchParams.get("q");
    const category = searchParams.get("category");

    if (query || category) {
      // If there are search params, perform search
      dispatch(
        searchProducts({
          query: query || "",
          category: category || "",
        })
      );
    } else {
      // Otherwise, load all products
      dispatch(getAllProducts());
    }
  }, [searchParams, dispatch]);

  return (
    <>
      <Navbar />
      <Card />
    </>
  );
};

export default ShopPage;
