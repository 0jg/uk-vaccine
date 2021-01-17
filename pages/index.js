import Head from 'next/head'
import moment from 'moment';
import dateArray from 'moment-array-dates';
//import '../node_modules/react-vis/dist/style.css';
import {MarkSeries, LabelSeries, ChartLabel, FlexibleXYPlot, HorizontalGridLines, LineSeries, XAxis, YAxis} from 'react-vis';

export default function Home(props) {

  const labels = dateArray.range(new Date('2021-01-10'), new Date('2021-02-15'))
  labels.reverse()

  // Initialise arrays
  let data = []
  let trend1m = []
  let trend2m = []
  let trend3m = []

  // Add data points to array
  labels.forEach((item, i) => {
    const date = new Date(item)
    data.push({x:date, y:props.values[i]})
    trend1m.push({x:date, y:props.values[i]})
    trend2m.push({x:date, y:props.values[i]})
    trend3m.push({x:date, y:props.values[i]})
  });

  let i = 0
  do{
    if(trend1m[i].y === undefined){
      trend1m[i].y = trend1m[i-1].y+1e6/7
      trend2m[i].y = trend2m[i-1].y+2e6/7
      trend3m[i].y = trend3m[i-1].y+3e6/7
    }
    i = i+1
  } while(i <= 36)

  return (
    <main className="flex flex-col items-center justify-center w-screen m-auto min-h-screen dark:bg-black dark:text-white text-center">
      <div className="max-w-screen-md">
        <h1 className="text-5xl md:text-7xl font-bold leading-tighter pt-24 px-2">🇬🇧 Vaccines Administered</h1>
        <h2 className="text-3xl md:text-4xl leading-tight py-4 px-2"><span className="text-blue-500">Cumulative vaccines</span> by date compared to the <span className="text-purple-500">target of 15 million first doses</span> by Feb 15.</h2>
        <h3 className="text-xl md:text-2xl leading-normal pb-4 px-8">The UK has given {props.values[props.values.length-1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} initial doses so far. <span className="text-gray-400 text-lg">({Math.round(100*props.values[props.values.length-1]/15000000)}% of target)</span></h3>
        <div className="w-full h-screen m-auto py-10 pr-10">
          <FlexibleXYPlot xType="time" yDomain={[0,20000000]} margin={{left: 110, bottom:110 }} className="m-auto dark:text-white text-black fill-current text-md">
            <HorizontalGridLines className="dark:text-gray-600 text-gray-300 border w-4 stroke-1 stroke-current"/>
            <XAxis title="Publication date" tickLabelAngle={-90} className="stroke-1 stroke-current font-extralight text-sm"/>
            <YAxis title="Cumulative vaccines" tickFormat={v => v/1e6+" million"} className="stroke-1 stroke-current font-extralight text-sm"/>
            <LineSeries data={trend1m} color="#ff453a" strokeWidth={2} strokeStyle="dashed" className="text-transparent fill-current"/>
            <LineSeries data={trend2m} color="#fe9f09" strokeWidth={2} strokeStyle="dashed" className="text-transparent fill-current"/>
            <LineSeries data={trend3m} color="#30d158" strokeWidth={2} strokeStyle="dashed" className="text-transparent fill-current"/>
            <LabelSeries data={[{x: new Date("2021-02-15T00:00:00.000Z"),y:17500000,label:"3m/week"},{x: new Date("2021-02-14T00:00:00.000Z"),y:15350000,label:"Target"},{x: new Date("2021-02-15T00:00:00.000Z"),y:13200000,label:"2m/week"},{x: new Date("2021-02-15T00:00:00.000Z"),y:8500000,label:"1m/week"}]} className="text-green fill-current"/>
            <LineSeries data={data} color="#037aff" strokeWidth={5} className="text-transparent fill-current"/>
            <MarkSeries color="#af52de" strokeWidth={10} data={[{x: new Date("2021-02-15T00:00:00.000Z"),y:15000000}]}/>
          </FlexibleXYPlot>
        </div>
        <footer className="text-sm text-gray-500 pb-10">Made by <a href="https://twitter.com/__jackg">@__jackg</a>. Code available at <a href="https://github.com/j-griffiths/uk-vaccine">GitHub</a>. Data from <a href="https://coronavirus.data.gov.uk/details/download">GOV.UK</a>.</footer>
      </div>
    </main>
  )
}

export async function getStaticProps(){

  let values = []

  const res = await fetch("https://api.coronavirus.data.gov.uk/v2/data?areaType=overview&metric=cumPeopleVaccinatedFirstDoseByPublishDate&format=json")
  .then(response => response.json())
  .then((data) => {
    data.body.forEach(e => {
      values.push(e.cumPeopleVaccinatedFirstDoseByPublishDate)
    });
  })
  .catch((err) => {
    console.error(err)
  })

  values.reverse()

  return{
    props:{
      values
    }
  }
}
