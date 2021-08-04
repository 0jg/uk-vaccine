import Head from "next/head";
import moment from "moment";
import dateArray from "moment-array-dates";
import {
	MarkSeries,
	LabelSeries,
	ChartLabel,
	FlexibleXYPlot,
	AreaSeries,
	HorizontalGridLines,
	LineSeries,
	XAxis,
	YAxis,
	Crosshair
} from "react-vis";

export default function Home(props) {
	if (props.error) {
		return (
			<div className="w-screen h-screen flex flex-col justify-center items-center">
				<h1 className="text-5xl pb-4">Daily data updating...</h1>
				<h2 className="text-3xl">Try again in 15 minutes.</h2>
			</div>
		);
	}

	const labels = dateArray.range(
		new Date("2021-01-10"),
		new Date("2021-09-31")
	);
	labels.reverse();

	// Initialise arrays
	let dataFirstDose = [];
	let dataSecondDose = [];

	// Add data points to array
	labels.forEach((item, i) => {
		const date = new Date(item);
		dataFirstDose.push({x: date, y: props.valuesFirstDose[i], y0: 0});
		dataSecondDose.push({x: date, y: props.valuesSecondDose[i], y0: 0});
	});

	return (
		<main className="flex flex-col items-center justify-center w-screen m-auto min-h-screen dark:bg-black dark:text-white text-center">
			<div className="w-screen md:max-w-screen-lg">
				<h1 className="text-5xl md:text-7xl font-bold leading-tighter pt-24 px-2">
					🇬🇧 Vaccines Administered
				</h1>
				<h2 className="text-3xl md:text-4xl leading-tight py-4 px-2">
					Cumulative <span style={{color: "rgb(248, 3, 83)"}}>first</span> and{" "}
					<span style={{color: "rgb(161, 93, 215)"}}>second</span> doses by
					date.
				</h2>
				<h3 className="text-xl md:text-2xl leading-normal pb-4 px-8">
					The UK has given a first dose to{" "}
					{Math.round(
						(100 * props.valuesFirstDose[props.valuesFirstDose.length - 1]) /
							52632729
					)}
					% of all adults{" "}
					<span className="inline-block">
						(
						{props.valuesFirstDose[props.valuesFirstDose.length - 1]
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
						people)
					</span>{" "}
					and has fully vaccinated{" "}
					{Math.round(
						(100 * props.valuesSecondDose[props.valuesSecondDose.length - 1]) /
							52632729
					)}
					% of all adults{" "}
					<span className="inline-block">
						(
						{props.valuesSecondDose[props.valuesSecondDose.length - 1]
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
						people)
					</span>
					.
				</h3>
				<div className="w-full h-screen m-auto py-10 pr-10">
					<FlexibleXYPlot
						xType="time"
						yDomain={[0, 52632729]}
						margin={{left: 110, bottom: 110}}
						className="m-auto dark:text-white text-black fill-current text-md"
					>
						<HorizontalGridLines className="dark:text-gray-600 text-gray-300 border w-4 stroke-1 stroke-current" />
						<XAxis
							title="Publication date"
							tickLabelAngle={-90}
							className="stroke-1 stroke-current font-extralight text-sm"
						/>
						<YAxis
							title="Cumulative vaccines"
							tickFormat={v => v / 1e6 + " million"}
							className="stroke-1 stroke-current font-extralight text-sm"
						/>
						<LineSeries
							data={dataFirstDose}
							color="rgb(248, 3, 83)"
							strokeWidth={5}
							className="text-transparent fill-current"
						/>
						<LineSeries
							data={dataSecondDose}
							color="rgb(161, 93, 215)"
							strokeWidth={5}
							className="text-transparent fill-current"
						/>
						<MarkSeries
							color="rgb(13, 132, 255)"
							strokeWidth={5}
							data={[{x: new Date("2021-02-15T00:00:00.000Z"), y: 15000000}]}
						/>
						<MarkSeries
							color="rgb(254, 159, 9)"
							strokeWidth={5}
							data={[{x: new Date("2021-04-15T00:00:00.000Z"), y: 32000000}]}
						/>
						<MarkSeries
							color="rgb(48, 209, 88)"
							strokeWidth={5}
							data={[{x: new Date("2021-07-31T00:00:00.000Z"), y: 52632729}]}
						/>
						<LabelSeries
							data={[
								{
									x: new Date("2021-02-15T00:00:00.000Z"),
									y: 15000000,
									label: "Over 70 and vulnerable"
								},
								{
									x: new Date("2021-04-15T00:00:00.000Z"),
									y: 32000000,
									label: "Over 50 and at risk"
								},
								{
									x: new Date("2021-07-31T00:00:00.000Z"),
									y: 52632729,
									label: "All adults"
								}
							]}
							className="text-green fill-current"
						/>
					</FlexibleXYPlot>
				</div>
				<footer className="text-sm text-gray-500 pb-10">
					Made by <a href="https://twitter.com/__jackg">@__jackg</a>. Code
					available at{" "}
					<a href="https://github.com/j-griffiths/uk-vaccine">GitHub</a>. Data
					from{" "}
					<a href="https://coronavirus.data.gov.uk/details/download">GOV.UK</a>.
				</footer>
			</div>
		</main>
	);
}

export async function getServerSideProps() {
	let valuesFirstDose = [];
	let valuesSecondDose = [];
	let error;

	let resFirstDose = await fetch(
		"https://api.coronavirus.data.gov.uk/v2/data?areaType=overview&metric=cumPeopleVaccinatedFirstDoseByPublishDate&format=json"
	)
		.then(response => response.json())
		.then(data => {
			data.body.forEach(e => {
				valuesFirstDose.push(e.cumPeopleVaccinatedFirstDoseByPublishDate);
			});
			error = false;
		})
		.catch(err => {
			console.error(err);
			error = true;
		});

	let resSecondDose = await fetch(
		"https://api.coronavirus.data.gov.uk/v2/data?areaType=overview&metric=cumPeopleVaccinatedSecondDoseByPublishDate&format=json"
	)
		.then(response => response.json())
		.then(data => {
			data.body.forEach(e => {
				valuesSecondDose.push(e.cumPeopleVaccinatedSecondDoseByPublishDate);
			});
			error = false;
		})
		.catch(err => {
			console.error(err);
			error = true;
		});

	valuesFirstDose.reverse();
	valuesSecondDose.reverse();

	return {
		props: {
			error,
			valuesFirstDose,
			valuesSecondDose
		}
	};
}
