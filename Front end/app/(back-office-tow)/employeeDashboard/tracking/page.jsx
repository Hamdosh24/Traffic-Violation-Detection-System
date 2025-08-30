"use client";
import Heading from "@/components/backoffice/Heading";
import SearchResults from "@/components/backoffice/SearchResults";
import SearchPlate from "@/components/backoffice/SearchPlate";
import { useState } from "react";

export default function VehicleTrackingPage() {
  const [searchData, setSearchData] = useState({
    driverInfo: null,
    sightings: [],
    loading: false,
    error: null,
  });

  const handleSearchResults = (data) => {
    setSearchData(data);
  };

  return (
    <div>
      <Heading title="تعقب سيارة من خلال رقم اللوحة" />
      <SearchPlate onSearchComplete={handleSearchResults} />
      <SearchResults
        driverInfo={searchData.driverInfo}
        sightings={searchData.sightings}
        loading={searchData.loading}
        error={searchData.error}
      />
    </div>
  );
}
