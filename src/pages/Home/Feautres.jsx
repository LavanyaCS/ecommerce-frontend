import React from 'react'
     import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faShippingFast, faExchangeAlt, faPhoneVolume } from "@fortawesome/free-solid-svg-icons";

function Feautres() {
  return (
    <div>
    <div className="grid grid-cols-12 gap-x-5 pb-3 text-base max-w-5xl">
      <div className="col-span-12 md:col-span-6 lg:col-span-3 pb-1">
        <div className="flex items-center border mb-4 p-6">
          <FontAwesomeIcon icon={faCheck} className="text-gray-900 mr-3 " />
          <h5 className="font-semibold">Quality Product</h5>
        </div>
      </div>

      <div className="col-span-12 md:col-span-6 lg:col-span-3 pb-1">
        <div className="flex items-center border mb-4 p-6">
          <FontAwesomeIcon icon={faShippingFast} className="text-gray-900 mr-2" />
          <h5 className="font-semibold">Free Shipping</h5>
        </div>
      </div>

      <div className="col-span-12 md:col-span-6 lg:col-span-3 pb-1">
        <div className="flex items-center border mb-4 p-6">
          <FontAwesomeIcon icon={faExchangeAlt} className="text-gray-900 mr-3" />
          <h5 className="font-semibold">14-Day Return</h5>
        </div>
      </div>

      <div className="col-span-12 md:col-span-6 lg:col-span-3 pb-1">
        <div className="flex items-center border mb-4 p-6">
          <FontAwesomeIcon icon={faPhoneVolume} className="text-gray-900 mr-3" />
          <h5 className="font-semibold">24/7 Support</h5>
        </div>
      </div>
    </div>
 
    </div>
  )
}


export default Feautres
