import Ember from 'ember';

export default Ember.Mixin.create({
	calcRenewalOffer : function(renewalUnit, renewalRanges) {
		var dtm = renewalUnit.get("currentDiscountToMarket") * 100,
			offer = renewalUnit.get("currentRent"),
			type, filtRanges, range, absDtm, from, to, mktDiff, grossPotlInc, potlIncPct;

		if( dtm < 0 ) {
			type = "below";
		} else if( dtm > 0 ) {
			type = "above";
		} else {
			type = "at";
		}

		filtRanges = renewalRanges.filterBy("type", type).sortBy("from");
		absDtm = Math.abs(dtm);

		// console.log("currentRent", offer);
		// console.log("type:", type);
		// console.log("absDtm:", absDtm);
		// console.log(filtRanges.get("firstObject"));

		if( type === "at" ) {
			// console.log("in the at mkt offer calc");
			offer = offer * (1 + (filtRanges.get("firstObject.minIncrease") / 100));
		} else {
			range = null;
			filtRanges.forEach(function(r) {
				from = r.get("from");
				to = r.get("to") || 9999999999999;
				if( absDtm > from && absDtm <= to ){
					range = r;
				}
			});
			if( range ) {
				if( type === "above" ) {
					// console.log("in the above mkt offer calc");
					offer = offer * (1 + (range.get("minIncrease") / 100));
				} else if( type === "below" ) {
					// console.log("in the below mkt offer calc");
					mktDiff = renewalUnit.get("cmr") - offer;
					// console.log("mktDiff:", mktDiff);
					// console.log("bringToMktRate:", range.get("bringToMktRate"));
					grossPotlInc = mktDiff * (range.get("bringToMktRate") / 100);
					// console.log("grossPotlInc:", grossPotlInc);
					potlIncPct = (grossPotlInc / offer) * 100;
					// console.log("potlIncPct:", potlIncPct);
					if( potlIncPct < range.get("minIncrease") ) {
						offer = offer * (1 + (range.get("minIncrease") / 100));
					} else if( potlIncPct > range.get("maxIncrease") ) {
						offer = offer * (1 + (range.get("maxIncrease") / 100));
					} else {
						offer = offer * (1 + (potlIncPct / 100));
					}
				}
			}
		}
		// console.log("offer:", offer);
		return offer;
	}
});
