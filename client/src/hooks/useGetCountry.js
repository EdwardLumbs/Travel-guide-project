import { useEffect, useState } from "react"

export default function useGetCountry (value) {
    const [chosenCountry, setChosenCountry] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchDestination = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/destination/getCountry/${value}`);
            
            const destination = await res.json();
            console.log(destination)
            setChosenCountry(destination);
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    useEffect(() => {
      fetchDestination();
    }, [value])

  return ({chosenCountry, loading});
}