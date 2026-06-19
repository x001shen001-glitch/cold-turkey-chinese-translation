var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var showOthersWeb = false;
var showOthersApp = false;

var formatCountAxis = function(val, axis) {
   return val;
}

var formatMinsAxis = function(val, axis) {
	return Math.floor(val / 60).toString() + " hr";
}

var exportableStats = [
	['stats-blocked-time-chart', []],
	['stats-blocked-number-chart', []],
	['stats-web-chart', []],
	['stats-app-chart', []],
];

function exportStats(chart) {
	var chartData = JSON.parse(JSON.stringify(exportableStats[chart]));
	var csv = chart.indexOf("stats-web") == 0 ? "Website Domain,Date (year-month-day),Minutes Used" : chart.indexOf("stats-app") == 0 ? "App Filename,Date (year-month-day),Minutes Used" : chart.indexOf("stats-blocked-number") == 0 ? "Block Type,Date (year-month-day),Number of Times Blocked" : "Block Type,Date (year-month-day),Minutes Blocked";
	for (var i = 0; i < chartData.length; i++) {
		var label = chartData[i]["label"];
		for (var j = 0; j < chartData[i]["data"].length; j++) {
			var date = new Date(chartData[i]["data"][j][0]);
			var dateString = date.getUTCFullYear().toString() + "-" + (date.getUTCMonth()+1).toString() + "-" + date.getUTCDate().toString();
			csv = csv + "\r\n" + label + "," + dateString + "," + chartData[i]["data"][j][1].toString();
		}	
	}
	window.external.ExportStats(csv);
}

function legendFormatter(label, series) {
	if (currentTheme == "light") {
		return '<div style="font-family:\'Open Sans\',sans-serif;font-size:12px;padding:2px;padding-right:15px;color:#27272A">' + label + '</div>';
	} else {
		return '<div style="font-family:\'Open Sans\',sans-serif;font-size:12px;padding:2px;padding-right:15px;color:#fafafa">' + label + '</div>';
	}
};

function handleToggleOthersWeb() {
	if (showOthersWeb) {
		showOthersWeb = false;
		$("#chart-legend-button-hide").hide();
		$("#chart-legend-button-show").show();
	} else {
		showOthersWeb = true;
		$("#chart-legend-button-show").hide();
		$("#chart-legend-button-hide").show();
	}
}
function handleToggleOthersApp() {
	if (showOthersApp) {
		showOthersApp = false;
		$("#chart-legend-button-app-hide").hide();
		$("#chart-legend-button-app-show").show();
	} else {
		showOthersApp = true;
		$("#chart-legend-button-app-show").hide();
		$("#chart-legend-button-app-hide").show();
	}
}
handleToggleOthersWeb();
handleToggleOthersApp();

var stats = function () {

	var colors = {
		"light" : {
			"border"		: "#d4d4d8",
			"lines"			: "#d4d4d8",
			"text"			: "#27272A",
			"background"	: "#fafafa",
			"shadow"		: "5px 5px rgba(102, 102, 102, 0.1)"
		},
		"dark" : {
			"border"		: "#52525B",
			"lines"			: "#424247",
			"text"			: "#fafafa",
			"background"	: "#424247",
			"shadow"		: "none"
		}
	}

	
	return {

		updateStatsTimeBlocked: function () {	
		
			if (!jQuery.plot) {
				return;
			}
			
			var data = JSON.parse(window.external.SendStats("web-app-blocked-time", "", "all", statsBlockedWebStart.unix(), statsBlockedWebEnd.unix()));
			exportableStats['stats-blocked-time-chart'] = data;
			
			function showChartTooltip(x, y, xValue, yValue) {
				var xOffset = 30;
				if (window.innerWidth - x - 150 - 30 < 0) {
					xOffset = -230;
				}
				$('<div id="tooltip" class="chart-tooltip">' + yValue + '<\/div>').css({
					'position': 'absolute',
					'display': 'none',
					'width': '150px',
					'top': y + 30,
					'left': x + xOffset,
					'border': '1px solid ' + colors[currentTheme].border,
					'padding': '5px 10px',
					'background-color': colors[currentTheme].background,
					'border-radius': '5px',
					'box-shadow': colors[currentTheme].shadow
				}).appendTo("body").show();
			}

			if ($('#stats-blocked-time-chart').size() != 0) {
				
				$.plot($("#stats-blocked-time-chart"),
					data,
					{
						series: {
							stack: true
						},
						bars: {
							show: true,
							align: "center",
							barWidth: 24 * 60 * 60 * 600
						},
						grid: {
							hoverable: true,
							tickColor: colors[currentTheme].lines,
							borderColor: colors[currentTheme].lines,
							borderWidth: 2
						},
						yaxis: {
							min: 0,
							tickDecimals: 0,
							tickSize: 180,
							tickFormatter: formatMinsAxis,
							font: { size: 12, lineHeight: 14, family: "Open Sans", color: colors[currentTheme].text }
						},
						axisLabels: {
							show: true
						},
						xaxis: {
							mode: "time",
							timeformat: "%e %b",
							tickSize: [1, "day"],
							tickLength: 0,
							axisLabelUseCanvas: true,
							font: { size: 12, lineHeight: 14, family: "Open Sans", color: colors[currentTheme].text }
						},
						legend:{
							show: true,
							container: $('#stats-blocked-time-legend'),
							noColumns: 5,
							labelFormatter: legendFormatter
						}
					}
				);

				var previousPoint = null;
				$("#stats-blocked-time-chart").bind("plothover", function (event, pos, item) {
					try {
						$("#x").text(pos.x.toFixed(2));
						$("#y").text(pos.y.toFixed(2));
						if (item) {
							if (previousPoint != item.datapoint) {
								previousPoint = item.datapoint;

								$("#tooltip").remove();
								var type = "";
								switch (item.seriesIndex) {
									case 0:
										type = " blocked with no breaks";
										break;
									case 1:
										type = " blocked with breaks";
										break;
									default:
										type = " with no blocks";
								}
								var unixDate = new Date(item.datapoint[0]);
								var total = Math.round(item.datapoint[1] - item.datapoint[2]);
								var formattedHour = Math.floor(total / 60).toString();
								var formattedMinute = Math.floor(total % 60).toString();
								var formattedString = "";
								if (formattedHour != "0") {
									formattedString = formattedHour + " hr, " + formattedMinute + " min";
								} else {
									formattedString = formattedMinute + " min";
								}

								showChartTooltip(item.pageX, item.pageY, item.datapoint[0], formattedString + type + ' on ' + unixDate.getUTCDate() + ' ' + months[unixDate.getUTCMonth()]);
							}
						} else {
							$("#tooltip").remove();
							previousPoint = null;
						}
					} catch (ex) {
						/* No Data, do nothing */
					}
				});

				$('.legendLabel').each(function(i, element) {
					try {
						var seriesName = $(element).text();
						$.each(data, function (i, obj) {
							if (obj["label"] == seriesName) {
								var total = 0;
								$.each(obj["data"], function (j, val) {
									total += val[1];
								});
								var formattedHour = Math.floor(total / 60).toString();
								var formattedMinute = Math.floor(total % 60).toString();
								var formattedString = "";
								if (formattedHour != "0") {
									formattedString = formattedHour + " hr, " + formattedMinute + " min";
								} else {
									formattedString = formattedMinute + " min";
								}
								var optionalWith = (seriesName == "no blocks") ? "with " : "";
								$(element).prop('title', 'A total of ' + formattedString + ' was spent ' + optionalWith + seriesName + ' for this time frame.');
							}
						});
					} catch (ex) {
					}
				});
				
			}

		},
		
		updateStatsNumberBlocked: function () {
		
			if (!jQuery.plot) {
				return;
			}
			
			var data = JSON.parse(window.external.SendStats("web-app-blocked", "", "all", statsBlockedAppStart.unix(), statsBlockedAppEnd.unix()));
			exportableStats['stats-blocked-number-chart'] = data;
			
			function showChartTooltip(x, y, xValue, yValue) {
				var xOffset = 30;
				if (window.innerWidth - x - 150 - 30 < 0) {
					xOffset = -180;
				}
				$('<div id="tooltip" class="chart-tooltip">' + yValue + '<\/div>').css({
					'position': 'absolute',
					'display': 'none',
					'width': '150px',
					'top': y + 30,
					'left': x + xOffset,
					'border': '1px solid ' + colors[currentTheme].border,
					'padding': '5px 10px',
					'background-color': colors[currentTheme].background,
					'border-radius': '5px',
					'box-shadow': colors[currentTheme].shadow
				}).appendTo("body").show();
			}

			if ($('#stats-blocked-number-chart').size() != 0) {

				$.plot($("#stats-blocked-number-chart"),
					data,
					{
						series: {
							stack: true
						},
						bars: {
							show: true,
							align: "center",
							barWidth: 24 * 60 * 60 * 600
						},
						grid: {
							hoverable: true,
							tickColor: colors[currentTheme].lines,
							borderColor: colors[currentTheme].lines,
							borderWidth: 2
						},
						yaxis: {
							min: 0,
							tickDecimals: 0,
							tickFormatter: formatCountAxis,
							font: { size: 12, lineHeight: 14, family: "Open Sans", color: colors[currentTheme].text }
						},
						axisLabels: {
							show: true
						},
						xaxis: {
							mode: "time",
							timeformat: "%e %b",
							tickSize: [1, "day"],
							tickLength: 0,
							axisLabelUseCanvas: true,
							font: { size: 12, lineHeight: 14, family: "Open Sans", color: colors[currentTheme].text }
						},
						legend:{
							show: true,
							container: $('#stats-blocked-legend'),
							noColumns: 5,
							labelFormatter: legendFormatter
						}
					}
				);

				var previousPoint = null;
				$("#stats-blocked-number-chart").bind("plothover", function (event, pos, item) {
					try {
						$("#x").text(pos.x.toFixed(2));
						$("#y").text(pos.y.toFixed(2));
						if (item) {
							if (previousPoint != item.datapoint) {
								previousPoint = item.datapoint;

								$("#tooltip").remove();
								var unixDate = new Date(item.datapoint[0]);
								var realValue = item.datapoint[1] - item.datapoint[2];
								var type = item.seriesIndex == 0 ? " website(s)" : " apps(s)";
								showChartTooltip(item.pageX, item.pageY, item.datapoint[0], realValue + type + ' blocked on ' + unixDate.getUTCDate() + ' ' + months[unixDate.getUTCMonth()]);
							}
						} else {
							$("#tooltip").remove();
							previousPoint = null;
						}
					} catch (ex) {
						/* No Data, do nothing */
					}
				});
				
				$('.legendLabel').each(function(i, element) {
					try {
						var seriesName = $(element).text();
						$.each(data, function (i, obj) {
							if (obj["label"] == seriesName) {
								var total = 0;
								$.each(obj["data"], function (j, val) {
									total += val[1];
								});
								var type = (seriesName == "websites blocked") ? " website(s)" : " apps(s)";
								$(element).prop('title', 'A total of ' + total + type + ' were blocked for this time frame.');
							}
						});
					} catch (ex) {
					}
				});
				
			}

		},

		toggleOthersWeb: function () {
			handleToggleOthersWeb();
		},
		updateStatsWeb: function () {	
		
			if (!jQuery.plot) {
				return;
			}
			
			var chartUsers = fromHtml($("#stats-web-users").val());
			var chartOptions = "";
			var chartType = "top5";
			chartType = $("#stats-web-type").val();
			if (chartType.indexOf("search-") == 0) {
				chartOptions = $("#stats-web-search-text").val();
			} else {
				chartOptions = fromHtml($("#stats-web-block-list").val());
			}
			
			var data = JSON.parse(window.external.SendStats("web-" + chartType, chartOptions, chartUsers, statsWebStart.unix(), statsWebEnd.unix()));
			if (!showOthersWeb) {
				data = data.filter(function (obj) {
					return obj["label"] !== "all other websites";
				});
			}
			exportableStats['stats-web-chart'] = data;
			
			function showChartTooltip(x, y, xValue, yValue) {
				var xOffset = 30;
				if (window.innerWidth - x - 150 - 30 < 0) {
					xOffset = -230;
				}
				$('<div id="tooltip" class="chart-tooltip">' + yValue + '<\/div>').css({
					'position': 'absolute',
					'display': 'none',
					'width': '200px',
					'top': y + 30,
					'left': x + xOffset,
					'border': '1px solid ' + colors[currentTheme].border,
					'padding': '5px 10px',
					'background-color': colors[currentTheme].background,
					'border-radius': '5px',
					'box-shadow': colors[currentTheme].shadow
				}).appendTo("body").show();
			}

			if ($('#stats-web-chart').size() != 0) {
				
				$.plot($("#stats-web-chart"),
					data,
					{
						series: {
							stack: true
						},
						bars: {
							show: true,
							align: "center",
							barWidth: 24 * 60 * 60 * 600
						},
						grid: {
							hoverable: true,
							tickColor: colors[currentTheme].lines,
							borderColor: colors[currentTheme].lines,
							borderWidth: 2
						},
						yaxis: {
							min: 0,
							tickDecimals: 0,
							tickSize: 60,
							tickFormatter: formatMinsAxis,
							font: { size: 12, lineHeight: 14, family: "Open Sans", color: colors[currentTheme].text }
						},
						axisLabels: {
							show: true
						},
						xaxis: {
							mode: "time",
							timeformat: "%e %b",
							tickSize: [1, "day"],
							tickLength: 0,
							axisLabelUseCanvas: true,
							font: { size: 12, lineHeight: 14, family: "Open Sans", color: colors[currentTheme].text }
						},	
						legend:{
							show: true,
							container: $('#stats-web-legend'),
							noColumns: 5,
							labelFormatter: legendFormatter
						}
					}
				);

				var previousPoint = null;
				$("#stats-web-chart").bind("plothover", function (event, pos, item) {
					try {
						$("#x").text(pos.x.toFixed(2));
						$("#y").text(pos.y.toFixed(2));
						if (item) {
							if (previousPoint != item.datapoint) {
								previousPoint = item.datapoint;

								$("#tooltip").remove();
								var unixDate = new Date(item.datapoint[0]);
								var total = Math.round(item.datapoint[1] - item.datapoint[2]);
								var formattedHour = Math.floor(total / 60).toString();
								var formattedMinute = Math.floor(total % 60).toString();
								var formattedString = "";
								if (formattedHour != "0") {
									formattedString = formattedHour + " hr, " + formattedMinute + " min";
								} else {
									formattedString = formattedMinute + " min";
								}

								showChartTooltip(item.pageX, item.pageY, item.datapoint[0], formattedString + ' spent visiting ' + item.series.label + ' on ' + unixDate.getUTCDate() + ' ' + months[unixDate.getUTCMonth()]);
							}
						} else {
							$("#tooltip").remove();
							previousPoint = null;
						}
					} catch (ex) {
						/* No Data, do nothing */
					}
				});

				$('.legendLabel').each(function(i, element) {
					try {
						var seriesName = $(element).text();
						$.each(data, function (i, obj) {
							if (obj["label"] == seriesName) {
								var total = 0;
								$.each(obj["data"], function (j, val) {
									total += val[1];
								});
								var formattedHour = Math.floor(total / 60).toString();
								var formattedMinute = Math.floor(total % 60).toString();
								var formattedString = "";
								if (formattedHour != "0") {
									formattedString = formattedHour + " hr, " + formattedMinute + " min";
								} else {
									formattedString = formattedMinute + " min";
								}
								$(element).prop('title', 'A total of ' + formattedString + ' was spent visiting ' + seriesName + ' for this time frame.');
							}
						});
					} catch (ex) {
					}
				});

			}

		},
		
		toggleOthersApp: function () {
			handleToggleOthersApp();
		},
		updateStatsApp: function () {	
		
			if (!jQuery.plot) {
				return;
			}
			
			var chartUsers = fromHtml($("#stats-app-users").val());
			var chartOptions = "";
			var chartType = "top5";
			chartType = $("#stats-app-type").val();
			if (chartType.indexOf("search") == 0) {
				chartOptions = $("#stats-app-search-text").val();
			} else {
				chartOptions = fromHtml($("#stats-app-block-list").val());
			}
			
			var data = JSON.parse(window.external.SendStats("app-" + chartType, chartOptions, chartUsers, statsAppStart.unix(), statsAppEnd.unix()));
			if (!showOthersApp) {
				data = data.filter(function (obj) {
					return obj["label"] !== "all other apps";
				});
			}
			exportableStats['stats-app-chart'] = data;
			
			function showChartTooltip(x, y, xValue, yValue) {
				var xOffset = 30;
				if (window.innerWidth - x - 150 - 30 < 0) {
					xOffset = -230;
				}
				$('<div id="tooltip" class="chart-tooltip">' + yValue + '<\/div>').css({
					'position': 'absolute',
					'display': 'none',
					'width': '200px',
					'top': y + 30,
					'left': x + xOffset,
					'border': '1px solid ' + colors[currentTheme].border,
					'padding': '5px 10px',
					'background-color': colors[currentTheme].background,
					'border-radius': '5px',
					'box-shadow': colors[currentTheme].shadow
				}).appendTo("body").show();
			}

			if ($('#stats-app-chart').size() != 0) {
				
				$.plot($("#stats-app-chart"),
					data,
					{
						series: {
							stack: true
						},
						bars: {
							show: true,
							align: "center",
							barWidth: 24 * 60 * 60 * 600
						},
						grid: {
							hoverable: true,
							tickColor: colors[currentTheme].lines,
							borderColor: colors[currentTheme].lines,
							borderWidth: 2
						},
						yaxis: {
							min: 0,
							tickDecimals: 0,
							tickSize: 60,
							tickFormatter: formatMinsAxis,
							font: { size: 12, lineHeight: 14, family: "Open Sans", color: colors[currentTheme].text }
						},
						axisLabels: {
							show: true
						},
						xaxis: {
							mode: "time",
							timeformat: "%e %b",
							tickSize: [1, "day"],
							tickLength: 0,
							axisLabelUseCanvas: true,
							font: { size: 12, lineHeight: 14, family: "Open Sans", color: colors[currentTheme].text }
						},	
						legend:{
							show: true,
							container: $('#stats-app-legend'),
							noColumns: 5,
							labelFormatter: legendFormatter
						}
					}
				);

				var previousPoint = null;
				$("#stats-app-chart").bind("plothover", function (event, pos, item) {
					try {
						$("#x").text(pos.x.toFixed(2));
						$("#y").text(pos.y.toFixed(2));
						if (item) {
							if (previousPoint != item.datapoint) {
								previousPoint = item.datapoint;

								$("#tooltip").remove();
								var unixDate = new Date(item.datapoint[0]);
								
								var total = Math.round(item.datapoint[1] - item.datapoint[2]);
								var formattedHour = Math.floor(total / 60).toString();
								var formattedMinute = Math.floor(total % 60).toString();
								var formattedString = "";
								if (formattedHour != "0") {
									formattedString = formattedHour + " hr, " + formattedMinute + " min";
								} else {
									formattedString = formattedMinute + " min";
								}

								showChartTooltip(item.pageX, item.pageY, item.datapoint[0], formattedString + ' spent using ' + item.series.label + ' on ' + unixDate.getUTCDate() + ' ' + months[unixDate.getUTCMonth()]);
							}
						} else {
							$("#tooltip").remove();
							previousPoint = null;
						}
					} catch (ex) {
						/* No Data, do nothing */
					}
				});
				
				$('.legendLabel').each(function(i, element) {
					try {
						var seriesName = $(element).text();
						$.each(data, function (i, obj) {
							if (obj["label"] == seriesName) {
								var total = 0;
								$.each(obj["data"], function (j, val) {
									total += val[1];
								});
								var formattedHour = Math.floor(total / 60).toString();
								var formattedMinute = Math.floor(total % 60).toString();
								var formattedString = "";
								if (formattedHour != "0") {
									formattedString = formattedHour + " hr, " + formattedMinute + " min";
								} else {
									formattedString = formattedMinute + " min";
								}
								$(element).prop('title', 'A total of ' + formattedString + ' was spent using ' + seriesName + ' for this time frame.');
							}
						});
					} catch (ex) {
					}
				});
				
			}

		}

	};

}();