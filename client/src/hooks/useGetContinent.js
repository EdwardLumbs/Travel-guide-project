import { useEffect, useState } from "react";

export default function useGetContinent (value) {
    const [continentData, setContinentData] = useState({});
    const [continentLoading, setLoading] = useState(false);
    const [continentError, setError] = useState(null);

    const fetchDestination = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/destination/getContinent/${value}`);
            
            const destination = await res.json();
            console.log(destination);
            setContinentData(destination);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error.message);
            console.log(error);
        }
    }

    useEffect(() => {
      fetchDestination();
    }, [value]);

  return ({continentData, continentLoading, continentError});
}