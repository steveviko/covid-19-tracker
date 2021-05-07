import React, { useState, useEffect} from 'react';
import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import './App.css';
import InforBox from './InforBox';
import Map from './Map';
import Table from './Table';
import { prettyPrintStat, sortData } from './utility';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css"

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({lat:34.80746,lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases")

  useEffect(() => {
   fetch("https://disease.sh/v3/covid-19/all")
   .then(response => response.json())
   .then(data => {
     setCountryInfo(data);
   });
  }, []);

//https://disease.sh/v3/covid-19/countries

  useEffect(() => {
    const getCountriesData = async () =>{

      await fetch(" https://disease.sh/v3/covid-19/countries ")
      .then((response ) => response.json())
      .then((data) => {
        const countries = 
          data.map((country) => ({
            name:country.country,
            value:country.countryInfo.iso2,//uk,us,ug
          }))

          const sortedData = sortData(data);

          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        
      })
    }
   
    getCountriesData();
  }, [])


  const onCountryChange = async (event) => {

    const countryCode = event.target.value;
    // console.log(countryCode);
    
    // setCountry(countryCode);
    //https://disease.sh/v3/covid-19/all
    //https://disease.sh/v3/covid-19/countries[countrycode]

    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : 
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then((response) => response.json())
    .then((data) => {

      setCountry(countryCode);
      // All of the data from a country response
      setCountryInfo(data);
       
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(3);
      // console.log(data)
    });

    
  };

  
  return (
    <div className="app">
      <div className="app_left" >
      <div className="app_header"> 
      
      <h1 className="app_title">Steveviko Covid-19 Tracker</h1>
     {/* {Header } */}
     <FormControl className="app_dropdown">
       <Select
       variant="outlined"
       onChange={onCountryChange}
       value={country}
       >
         <MenuItem  value="worldwide"> World Wide</MenuItem>
        {countries.map( (country) => (
            
             <MenuItem  value={country.value}>{country.name}</MenuItem>
        ))}
        
         

       </Select>


     </FormControl>
      
      
      
       </div>
    
    <div className="app_stats">

      <InforBox
      isRed
      active={casesType==="cases"}
      onClick={e => setCasesType('cases')}
      title="Coronavirus Cases" 
      cases={prettyPrintStat(countryInfo.todayCases)} 
      total={prettyPrintStat(countryInfo.cases)} 
      
      />

      <InforBox 
        active={casesType==="recovered"}
        onClick={e => setCasesType('recovered')}
        title="Recovered"
        cases={prettyPrintStat(countryInfo.todayRecovered)}
        total={prettyPrintStat(countryInfo.recovered)} 
        />

      <InforBox
      isRed 
      active={casesType==="deaths"}
      onClick={e => setCasesType('deaths')}
      title="Deaths" 
      cases={prettyPrintStat(countryInfo.todayDeaths)} 
      total={prettyPrintStat(countryInfo.deaths)}
        />
    {/* {inforbox  } */}
    
    {/* {inforbox  title="coronovirus recoveries " } */}
    {/* {inforbox   title="coronovirus deaths" } */}
    </div>




    {/* {map } */}
          <Map 
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
          
          />

      </div>

     <Card className="app_right">
       <CardContent>
          
        
          <h3>Live Cases By Country</h3>
          {/* {tables } */}
          <Table countries={tableData}/>
          {/* {graph } */}
          <h3 className="app_graphTitle">WorldWide New {casesType} </h3>
          <LineGraph className="app_graph" casesType={casesType}/>
       </CardContent>
       
     </Card>
   
   

    </div>
  );
}

export default App;
