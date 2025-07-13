import { Link } from 'react-router-dom'
import Search from '../components/SearchBar'
import { ArrowRight } from 'lucide-react'
import NavBar from '../components/NavBar'


export default function Home() {
  return (
    <div className="flex flex-col h-full w-full bg-white">
      <NavBar title="Home" />

      <section className="mt-16 w-full bg-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-8">
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Find Your Perfect Style
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Connect with top-rated hair professionals & book appointments
                easily.
              </p>
              <div className="mb-5 w-full max-w-md mx-auto md:mx-0">
                <Search service="" location="" />
              </div>
              <div className="mb-8 flex flex-wrap justify-center md:justify-start gap-2 text-sm text-gray-600">
                <span className="bg-gray-100 px-3 py-1 rounded-full">
                  Haircuts
                </span>
                <span className="bg-gray-100 px-3 py-1 rounded-full">
                  Styling
                </span>
                <span className="bg-gray-100 px-3 py-1 rounded-full">
                  Coloring
                </span>
                <span className="bg-gray-100 px-3 py-1 rounded-full">
                  Treatments
                </span>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <img
                src="src/images/promo_image.png"
                alt="Trimly Stylists"
                className="h-64 md:h-80 object-contain shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="h-full bg-gray-900 text-white items-center">
        <div className="flex py-10 flex-col md:flex-row justify-between items-center mx-auto px-6 md:px-[100px] text-center md:text-left">
          <div>
            <h2 className="text-xl font-bold mb-4">Are You a Stylist?</h2>
            <p className="text-base mb-8 max-w-2xl mx-auto">
              Grow your career with Trimly. Get access to new clients, booking
              management tools, and more.
            </p>
          </div>
          <Link
            to="/Join"
            className="inline-flex items-center rounded-md h-10 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-100 transition"
          >
            Join Our Network
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
