import Ember from 'ember';
import EmberHighChartsComponent from 'ember-highcharts/components/high-charts';

export default EmberHighChartsComponent.extend({
	chartOptionsDidChange : Ember.observer("chartOptions.xAxis.@each.categories", function() {
		let chart = this.get("chart"),
			cats = this.get("chartOptions.xAxis.firstObject.categories");
		chart.xAxis[0].update({ categories : cats });
		chart.redraw();
	})
});
