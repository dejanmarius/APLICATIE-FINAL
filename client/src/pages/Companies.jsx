import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CompanyCard,
  CustomButton,
  Header,
  ListBox,
  Loading,
} from "../components";
import { apiRequest, updateURL } from "../utils";

const Companies = () => {
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordsCount, setRecordsCount] = useState(0);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cmpLocation, setCmpLocation] = useState("");
  const [sort, setSort] = useState("Newest");
  const [isFetching, setIsFetching] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    setIsFetching(true);

    const newUrl = updateURL({
      pageNum: page,
      query: searchQuery,
      cmpLoc: cmpLocation,
      sort: sort,
      navigate: navigate,
      location: location,
    });

    try {
      const res = await apiRequest({
        url: newUrl,
        method: "GET",
      });

      setNumPage(res?.numOfPage);
      setRecordsCount(res?.total);
      setData(res?.data);

      setIsFetching(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await fetchCompanies();
  };
  const handleShowMore = () => {};
  
  useEffect(() => {
    if (searchQuery === "") {
      setPage(1); // Resetează numărul paginii
      fetchCompanies();
    }
  }, [searchQuery]);
  useEffect(() => {
    document.title = "Companies";
    fetchCompanies();
  }, [page, sort]);

  return (
    <div className="w-full dark:bg-slate-800">
      <Header
        title="Find Your Dream Company"
        handleClick={handleSearchSubmit}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={cmpLocation}
        setLocation={setCmpLocation}
      />

      <div className="container mx-auto flex flex-col gap-5 2xl:gap-10 px-10 py-6 bg-[#f7fdfd]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm md:text-base dark:text-slate-400">
            Showing: <span className="font-semibold">{recordsCount}</span>{" "}
            Companies Available
          </p>

          <div className="flex flex-col md:flex-row gap-0 md:gap-2 md:items-center">
            <p className="text-sm md:text-base dark:text-slate-400">Sort By:</p>

            <ListBox sort={sort} setSort={setSort} />
          </div>
        </div>

        <div className="w-full flex flex-col gap-6">
          {data?.map((cmp, index) => (
            <CompanyCard cmp={cmp} key={index} />
          ))}

          {isFetching && (
            <div className="mt-10">
              <Loading />
            </div>
          )}
        </div>

        {numPage > page && !isFetching && (
          <div className="w-full flex items-center justify-center pt-16">
            <CustomButton
              onClick={handleShowMore}
              title="Load More"
              containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;