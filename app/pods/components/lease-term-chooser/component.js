import Ember from 'ember';

export default Ember.Component.extend({

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
	}),

	actions : {
		toggleLtc : function(ltc) {
			ltc.get("terms").setEach("isChecked", ltc.get("isChecked"));
		},
		toggleLeaseTerm : function(ltc) {
			var allChecked = ltc.get("terms").reduce(function(prev, item) {
				if( item.get("isChecked") ) {
					return 1 + prev;
				} else {
					return prev;
				}
			}, 0);

			if( allChecked === ltc.get("terms.length") ) {
				ltc.set("isChecked", true);
			} else {
				ltc.set("isChecked", false);
			}
		},
		selectAllTerms : function() {
			this.controller.get("leaseTermCategories").forEach(function(ltc) {
				ltc.set("isChecked", true);
				ltc.get("terms").setEach("isChecked", true);
			});
		},
		deselectAllTerms : function() {
			this.controller.get("leaseTermCategories").forEach(function(ltc) {
				ltc.set("isChecked", false);
				ltc.get("terms").setEach("isChecked", false);
			});
		}
	}
});
