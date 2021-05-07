import numeral from 'numeral';
import React, {useEffect, useState} from 'react'
import {Line } from 'react-chartjs-2';

function LineGraph({casesType='cases', ...props}) {

    const [data, setData] = useState({});


    const options = {
        legend:{
            
            display:false
        },
        elements:{
            point:{
                radius:0,

            }
        },

        maintainAspectRaatio:false,
        tooltips:{
            mode:"index",
            intersect:false,
            callbacks:{
                label:function(tooltipItem,data){
                    return numeral(tooltipItem.value).format("+0,0")
                },
            },
        },
        scales:{
            xAxes:[
                {
                    type:"time",
                    time:{
                        parser:"MM/DD/YY",
                        tooltipFormat:"ll"
                    },

                },
            ],
            yAxes:[{
                gridLines:{
                    display:false,
                },
                ticks:{
                    //include a dollar sign in the tricks
                    callback: function(value, index, values){
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
        }
    }

    //https://disease.sh/v3/covid-19/historical/all?lastdays=120

    useEffect(() => {
        const fetchData = async () => {
           await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then(response => response.json())
            .then((data) =>{
                    // console.log(data)
                    const chartData =buildChartData(data, casesType);
                    setData(chartData)
            })
        }
       
       fetchData()
    }, [casesType])

    const buildChartData = (data,casesType='cases') =>{

        const chartData = [];
        let lastDataPoint;

        for(let date in data.cases){
            if(lastDataPoint){
                const newDataPoint ={
                    x:date,
                    y:data[casesType][date] - lastDataPoint
                }

                chartData.push(newDataPoint)
                
            }
            lastDataPoint = data[casesType][date]; 
        }
        return chartData
    }
    return (
        <div className={props.className}>
            {data.length > 0 && ( 

            <Line
            data={{
                datasets:[{
                    backgroundColor:"rgba(204,16,52 0.5)",
                    borderColor:"#CC1034",
                    data:data
                }]
            }}
            options={options}

            />
            )}
            
        </div>
    )
}

export default LineGraph
