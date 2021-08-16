sap.ui.define(['sap/ui/core/UIComponent', 'sap/ui/model/json/JSONModel', 'sap/ui/Device'], function (UIComponent, JSONModel, Device) {
	'use strict';
	return UIComponent.extend('sap.ui.core.sample.RoutingMasterDetail.restApp', {
		
		"metadata": {
        	"rootView": "sap.ui.core.sample.RoutingMasterDetail.restApp.view.Master"
		},

		init: function () {
			this.setModel(this.createDeviceModel(), 'device');
			UIComponent.prototype.init.apply(this, arguments);
		},

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode('OneWay');
			return oModel;
		}
	});
}, /* bExport= */ true);