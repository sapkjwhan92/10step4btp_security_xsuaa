sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/Device', 'sap/ui/model/json/JSONModel', 'sap/ui/core/Fragment', 'sap/m/MessageToast'],
	function (
		Controller, Device, JSONModel, Fragment, MessageToast) {
		'use strict';

		return Controller.extend('sap.ui.core.sample.RoutingMasterDetail.restApp.controller.Master', {
			onInit: function () {
				this.getUsername();
				this.refreshModel();				
			},

			refreshModel: function () {
				URL = '/api/users';
				var oModel = new JSONModel();
				this.getView().setModel(oModel);
				oModel.attachRequestCompleted(null, function() {
					sap.ui.core.BusyIndicator.hide();
				});
				oModel.attachRequestFailed(null, function(oEvent) {
					var code = oEvent.getParameter("statusCode");
					var msg = null;
					if (code === 401 || code === 403) {
						msg = 'You are not authorized.';
					} else {
						msg = 'An internal error occurred.';
					}
					this.showErrorAlert(msg);
				}, this);
				sap.ui.core.BusyIndicator.show(500);
				oModel.loadData(URL);
			},

			getUsername: function() {
				URL = '/currentUser';
				var oModel = new JSONModel();
				this.getView().setModel(oModel, "username");
				oModel.loadData(URL);
			},
			
			handleLogout: function() {
                sap.m.URLHelper.redirect('/do/logout');
	        },

			onOpenDialog: function () {
				var oView = this.getView();

				// create dialog lazily
				if (!this.byId("addUserDialog")) {
					// load asynchronous XML fragment
					Fragment.load({
						id: oView.getId(),
						name: "sap.ui.core.sample.RoutingMasterDetail.restApp.view.AddUserDialog",
						controller: this
					}).then(function (oDialog) {
						// connect dialog to the root view of this component (models, lifecycle)
						oView.addDependent(oDialog);
						oDialog.open();
					});
				} else {
					this.byId("addUserDialog").open();
				}
			},

			onCloseDialog: function () {
				var oView = this.getView();
				var nameInput = oView.byId("inputName");
				var ageInput = oView.byId("inputAge");
				var name = nameInput.getValue().trim();
				var age = parseInt(ageInput.getValue().trim(), 10);
				
				if (name == "" || isNaN(age)) {
					this.showErrorAlert("Invalid data.");
					return;
				}

				$.ajax({
					type: "POST",
					url: '/api/users',
					context: this,
					data: JSON.stringify({ "name": name, "age" : age }),
					contentType: "application/json",
					success: function () {
						this.refreshModel();
						MessageToast.show('User saved successfully.');
						nameInput.setValue("");
						ageInput.setValue("");
						this.getView().byId("addUserDialog").close();
					},
					error: function (res) {
						var msg = null;
						if (res.status === 401 || res.status === 403) {
							msg = 'You are not authorized.';
						} else {
							msg = 'An internal error occurred.';
						}
						this.showErrorAlert(msg);
					},
					dataType: 'json'
				});
			},
			
			handleDelete: function(oEvent) {
				var oList = oEvent.getSource(),
					oItem = oEvent.getParameter("listItem");
					
				// after deletion put the focus back to the list
				oList.attachEventOnce("updateFinished", oList.focus, oList);
				
	            // Get id from the description property
	            var id = oItem.getProperty("description").substring(4);

	            var msg = null;

	            $.ajax({
	                type: "DELETE",
	                url: '/api/users/' + id,
	                context: this,
	                success: function (res) {
	                    this.refreshModel();
	                },
	                error: function (res) {
	                    if (res.status === 401 || res.status === 403) {
	                        msg = 'You are not authorized.';
	                    } else if (res.status == 404) {
							msg = 'Object not found.';
	                    } else {
	                        msg = 'An internal error occurred.';
	                    }
	                    this.showErrorAlert(msg);
	                }
	            });
	        },

			showErrorAlert: function (sMessage) {
				jQuery.sap.require('sap.m.MessageBox');
				sap.m.MessageBox.error(sMessage, {
					title: 'Error'
				});
			}
		});
	}, true);