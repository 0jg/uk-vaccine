import Head from 'next/head'
import csv from 'csv-parser'
import Moment from 'moment';
import dateArray from 'moment-array-dates';
import '../node_modules/react-vis/dist/style.css';
import {ChartLabel, FlexibleXYPlot, HorizontalGridLines, LineSeries, XAxis, YAxis} from 'react-vis';

export default function Home(props) {

  const labels = dateArray.range(new Date('2021-01-10'), new Date('2021-02-15'))
  labels.reverse()

  let data = []
  let targets = []
  labels.forEach((item, i) => {
    data.push({x:new Date(item), y:props.values[i]})
    targets.push({x:new Date(item), y:15000000})
  });

  return (
    <main className="flex flex-col items-center justify-center min-w-screen max-w-screen-md m-auto min-h-screen dark:bg-black dark:text-white p-10 text-center">
        <h1 className="text-7xl font-bold leading-tighter pb-8">🇬🇧 Vaccines Administered</h1>
        <h2 className="text-4xl leading-tight"><span className="text-rose-500">Cumulative vaccines</span> by date compared to the <span className="text-purple-500">target of 15 million doses</span> by Feb 15.</h2>
        <div className="w-full h-96 py-10">
          <FlexibleXYPlot xType="time" margin={{left: 100, bottom: 60, right: 60}} style={{fontSize:'20px'}} yDomain={[1,20000000]}>
          <ChartLabel text="Cumulative vaccinations" className="alt-y-label" includeMargin={false} xPercent={-0.14} style={{ transform: 'rotate(-90)', textAnchor: 'end', fontSize: '2em' }} />
            <HorizontalGridLines />
            <XAxis title="Date" tickLabelAngle={-90} style={{marginBottom: '1em'}}/>
            <YAxis tickFormat={v => v/1e6+" million"}/>
            <LineSeries data={data} color="#f80353" style={{strokeWidth: 5}}/>
            <LineSeries data={targets} color="#a15dd7" style={{strokeWidth: 5}}/>
          </FlexibleXYPlot>
        </div>
        <footer className="text-sm text-gray-400">Made by <a href="https://twitter.com/__jackg">@__jackg</a></footer>
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
