import { Link, useParams } from "react-router-dom";
import useGetContinent from "../hooks/useGetContinent";
import useGetContinentCountries from "../hooks/useGetContinentCountries";
import DestinationCard from "../components/cards/DestinationCard";
import News from "../components/News";
import { useEffect, useState } from "react";
import TripModal from "../components/TripModal";
import { useSelector } from 'react-redux';
import ImageHero from "../components/heroComponent/ImageHero";
import BlogCards from "../components/cards/BlogCards";

export default function Continent() {
  const { currentUser } = useSelector((state) => state.user);
  const [blogLoading, setBlogLoading] = useState(false)
  const [blogError, setBlogError] = useState(null)
  const [blogs, setBlogs] = useState([])

  const { continent } = useParams();
  const {continentData, continentLoading, continentError} = useGetContinent(continent);
  const {continentCountries, continentCountriesLoading, continentCountriesError} = useGetContinentCountries(continent);
  const [isModalOpen, setModalOpen] = useState(false);

  console.log(blogs)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setBlogLoading(true)
        const res = await fetch(`/api/blogs/getBlogs?limit=4&tag1=${continentData.continent_name}`)
        const data = await res.json()
        console.log(data)
        if (data.success === false) {
          setBlogError(data.message)
          setBlogLoading(false)
          return
        }
        setBlogs(data)
        setBlogError(null)
        setBlogLoading(false)
      } catch (error) {
        console.log(error.message)
        setBlogError(error.message)
        setBlogLoading(false)
      }
    }

    fetchBlogs()
  }, [continentData.continent_name])

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      {continentError ? 
        <p className="text-3xl">
          {continentError}
        </p>
      : continentLoading ? 
        <p className="text-3xl">
          Loading...
        </p>
      :
      <div className="">
        <div className="">
          <ImageHero image={continentData.continent_photo} />
          <div className="mt-4 container flex flex-col mx-auto px-4 h-[300px]">
              <p className="text-6xl">
                {continentData.continent_name} 
              </p>
              <p className="mt-4 text-justify">
                {continentData.continent_description}
              </p>
              {
                currentUser &&
                <>
                  <p 
                    className="hover:underline hover:cursor-pointer text-blue-600"
                    onClick={openModal}  
                  >
                    Start a plan
                  </p>
                  <div className="">
                    <TripModal  
                      isOpen={isModalOpen}
                      onClose={closeModal}
                      currentDestination={continentData.continent_name}
                      user_id={currentUser.id}
                    />
                  </div>
                  
                </>
              }

          </div>
        </div>

        <div className="bg-blue-100 py-7 mx-0 lg:mx-2 lg:px-4 lg:rounded-3xl">
          <div className="mt-4 container gap-4 flex flex-wrap mx-auto px-4 ">
            {
              continentCountriesError ?
                <p className="text-3xl">
                  {continentCountriesError}
                </p> 
              : continentCountriesLoading ? 
                <p className="text-3xl">
                  Loading...
                </p> : 
                
                continentCountries.map((country) => (
                  <Link to={`${country.country}`}>
                    <div className="">
                      <DestinationCard key={country.id} destination={country}/>
                    </div>
                  </Link>
                ))  
            }
            { continentCountries.length >= 4 &&
            <Link
              className="hover:cursor-pointer hover:underline"
              to={`/destinations?type=country&sort=ASC&page=1&continent=${continentData.continent_name}`}
            >See More
            </Link>
            }
          </div>
        </div>
        
        <div className="container py-7 mx-auto px-4">
          <div className="mt-4 container gap-4 flex flex-wrap mx-auto px-4 ">
            {
              blogError ?
                <p className="text-3xl">
                  {blogError}
                </p> 
              : blogLoading ? 
                <p className="text-3xl">
                  Loading...
                </p> 
              : 
                blogs.map((blog) => (
                  <Link to={`/blogs/${blog.id}`}>
                    <div className="">
                      <BlogCards blog={blog}/>
                    </div>
                  </Link>
                ))  
            }
            { blogs.length >= 4 &&
            <Link
              className="hover:cursor-pointer hover:underline"
              to={`/blogs?type=${continentData.continent_name}&page=1`}
            >See More
            </Link>
            }
          </div>
        </div>

        <div className="bg-green-100 py-7 mx-0 lg:mx-2 lg:px-4 lg:rounded-3xl">
          <div className="mt-4 container px-4 mx-auto">
            <News place={continentData.continent_name}/>
          </div>
        </div>

      </div>
    }
    </div>
  )
}
