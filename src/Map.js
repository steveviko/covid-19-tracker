import React from 'react'
import './Map.css'
// import { Map as LeafletMap, TileLayer } from "react-leaflet"
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import { showDataOnMap } from './utility';

function Map({countries, casesType, center, zoom}) {
    return (
        <div className="map">
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* {loop through countries and draw a bunch of circles on the screen} */}
                    {showDataOnMap(countries, casesType)}
            </LeafletMap>
            
        </div>
    )
}

export default Map
