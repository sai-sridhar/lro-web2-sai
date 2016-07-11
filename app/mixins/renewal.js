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

		if( type === "at" ) {
			offer = offer * (1 + (filtRanges.get("firstObject.minIncrease") / 100));
			range = filtRanges.get("firstObject");
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
					offer = offer * (1 + (range.get("minIncrease") / 100));
				} else if( type === "below" ) {
					mktDiff = renewalUnit.get("cmr") - offer;
					grossPotlInc = mktDiff * (range.get("bringToMktRate") / 100);
					potlIncPct = (grossPotlInc / offer) * 100;
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
		return {
			offer : offer,
			range : range
		};
	}
});
