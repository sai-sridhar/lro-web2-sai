import Ember from 'ember';

export default Ember.Controller.extend({

	leaseTermCategories : Ember.computed(function() {
		var content = Ember.ArrayProxy.create({ content : Ember.A([])});

		var ltcs = [
			{	ltc : "Month to month",
				terms : [
					{	term : 1,
						text : "Month to month"}
				]
			},
			{	ltc : "Short Terms",
				terms : [
					{	term : 2,
						text : "2 months"
					},
					{	term : 3,
						text : "3 months"
					},
					{	term : 4,
						text : "4 months"
					},
					{	term : 5,
						text : "5 months"
					}
				]
			},
			{	ltc : "Medium Terms",
				terms : [
					{	term : 6,
						text : "6 months"
					},
					{	term : 7,
						text : "7 months"
					},
					{	term : 8,
						text : "8 months"
					},
					{	term : 9,
						text : "9 months"
					}
				]
			},
			{	ltc : "Long Terms",
				terms : [
					{	term : 10,
						text : "10 months"
					},
					{	term : 11,
						text : "11 months"
					},
					{	term : 12,
						text : "12 months"
					}
				]
			}
		];

		for( var i = 0; i < ltcs.length; i++) {
			var newLtc = Ember.Object.create({
				ltc : ltcs[i].ltc,
				terms : Ember.ArrayProxy.create({ content : Ember.A([])})
			});

			for( var k = 0; k < ltcs[i].terms.length; k++ ) {
				var newTerm = Ember.Object.create({
					term : ltcs[i].terms[k].term,
					text : ltcs[i].terms[k].text
				});
				newLtc.get("terms").pushObject(newTerm);
			}
			content.pushObject(newLtc);
		}

		return content;
	})
});
