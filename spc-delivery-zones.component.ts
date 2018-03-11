import { Component, OnInit,EventEmitter } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { VerkaufsburoSpcService } from '../../../services/verkaufsburo-spc.service';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { Subscription } from 'rxjs';
declare var $: any;
import {MarkererrorComponent} from '../markererror/markererror.component';

@Component({
  selector: 'app-spc-delivery-zones',
  templateUrl: './spc-delivery-zones.component.html',
  styleUrls: ['./spc-delivery-zones.component.css']
})
export class SpcDeliveryZonesComponent implements OnInit {

  sellingpoint: any;
	username: string;
	deliveryzones: any;
	finaldeliveryzone: any;
	viewsnack123: boolean = false;
	sellinpointname: string;
	sellingpoint_lat: any;
	sellingpoint_lng: any;
	sellingpoint_id: string;
	verkaufsburos:any;
	options: any;
	clickedview = 'mapview';
	map: any;
	layers: L.Layer[];
	markerClusterData;
	fitBounds: L.LatLngBounds;
	order: string = 'traveldistance';
	submitbutton: boolean = false;
	afterlieferclick: boolean = false;
	busy: Subscription;
	lessvalue: boolean = false;
	clickedmarker: any;
	orders: any[] = [
		{ value: "Entfernung", name: "traveldistance" },
		{ value: "Postleitzahl", name: "country_code" },
		{ value: "Stadt", name: "place_name" }
	];

	constructor(public dialogRef: MdDialogRef<SpcDeliveryZonesComponent>, public VerkaufsburoSpcService: VerkaufsburoSpcService, public dialog: MdDialog) {
		for (var i = 1; i < 60; i++) {
			this.tabs.push({
				name: "Tab" + i,
				active: i === 1 ? true : false
			});
		}
		this.VerkaufsburoSpcService.verkaufsburos.subscribe((data) => {
			this.verkaufsburos = data;
	
		});
		this.VerkaufsburoSpcService.deliveryzones.subscribe((data) => {
			this.deliveryzones = data;
		});

	}

	markererror(a, b, c, d, e) {
		let dialogRef = this.dialog.open(MarkererrorComponent, { width: '500px', disableClose: true });
		dialogRef.componentInstance.markeractive = a.icon;

		dialogRef.componentInstance.onactivee1.subscribe(result => {
			if (result.deactive) {
				if (a.icon == true) {

					this.VerkaufsburoSpcService.disableremove(b).subscribe(
						data => {
							console.log(data)
							this.finaldeliveryzone = data[d]['temp'];
							this.clickedmarker.target.setIcon(this.clickedmarker.target._popup.options.iconname);
							this.clickedmarker.target._popup.options.icon = false;

						}
					);
				} else {

					this.VerkaufsburoSpcService.disableadd(b).subscribe(
						data => {
							this.finaldeliveryzone = data[d]['temp'];
							this.clickedmarker.target.setIcon(e);
							this.clickedmarker.target._popup.options.icon = true;

						}
					);

				}
			}
			if (result.deactiveinput) {
				let object = {
					feedback_data: result.data,
					marker_id: a.id
				};
				this.VerkaufsburoSpcService.feedback_errors(object).subscribe(
					data => {
						if (data) {
							this.viewsnack123 = true;
							setTimeout(() => {
								this.viewsnack123 = false;
							}, 2500);




						}
					}
				);

			}

		});




	}


	sortingorder(ordername) {
		if (ordername == 'Postleitzahl') {
			this.order = 'country_code';
		}
		else if (ordername == 'Stadt') {
			this.order = 'place_name';
		}
		else {
			this.order = 'traveldistance';
		}

	}
	////////////////////////////////////////////////////////////////////////////////////////// Adding Markeres //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	methodme(sellingpoint, username) {

		var BlueIcon = L.icon({
			iconUrl: 'http://cdnjs.cloudflare.com/ajax/libs/leaflet/0.5.1/images/marker-icon.png',
			shadowUrl: 'http://cdnjs.cloudflare.com/ajax/libs/leaflet/0.5.1/images/marker-shadow.png',
			iconSize: [12, 20],
			iconAnchor: [6, 20],
			popupAnchor: [1, -17],
			shadowSize: [20, 20]

		});

		var greenIcon = new L.Icon({
			iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
			shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
			iconSize: [12, 20],
			iconAnchor: [6, 20],
			popupAnchor: [1, -17],
			shadowSize: [20, 20]
		});


		var redIcon = new L.Icon({
			iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
			shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41]

		});


		var orangeIcon = new L.Icon({
			iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
			shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
			iconSize: [12, 20],
			iconAnchor: [6, 20],
			popupAnchor: [1, -17],
			shadowSize: [20, 20]
		});


		var violetIcon = new L.Icon({
			iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
			shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
			iconSize: [12, 20],
			iconAnchor: [6, 20],
			popupAnchor: [1, -17],
			shadowSize: [20, 20]
		});


		var greyIcon = new L.Icon({
			iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
			shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
			iconSize: [12, 20],
			iconAnchor: [6, 20],
			popupAnchor: [1, -17],
			shadowSize: [20, 20]
		});

		var array = [];

		for (var key in this.finaldeliveryzone) {



			for (var i = 0; i < this.finaldeliveryzone[key].plz.length; i++) {
				var item = this.finaldeliveryzone[key].plz[i];
				var icon, iconname;

				switch (this.finaldeliveryzone[key].zoneinfo.color) {
					case '#277fca':
						icon = BlueIcon;
						iconname = BlueIcon;

						break;
					case '#ca8428':
						icon = orangeIcon;
						iconname = orangeIcon;
						break;
					case '#25ac22':
						icon = greenIcon;
						iconname = greenIcon;
						break;
					case '#9a28ca':
						icon = violetIcon;
						iconname = violetIcon;

						break;
					default:
						icon = BlueIcon;
						iconname = BlueIcon;

				}
				var value = false;

				if ((this.finaldeliveryzone[key]['zoneinfo']['disabled']).includes(item._id)) {
					icon = greyIcon;
					value = true;
				}


				var marker = L.marker([item['latitude'], item['longitude']], {
					icon: icon

				}).bindPopup(item['traveldistance'] + ' KM, ' + item['country_code'] + ', ' + item['place_name'] + ' ' + item['suburb']);

				marker['_popup']['options']['id'] = item['_id'];
				marker['_popup']['options']['key'] = key;
				marker['_popup']['options']['icon'] = value;
				marker['_popup']['options']['iconname'] = iconname;


				array.push(marker);
				marker.on('mouseover', function (e) {
					this.openPopup();
				});
				marker.on('mouseout', function (e) {
					this.closePopup();
				});
				var that = this;

				marker.on('click', function (a) {
					let object = { id: a.target._popup.options.id, key: a.target._popup.options.key, sellingpoint_id: sellingpoint };
					var hello = that.markererror(a.target._popup.options, object, username, sellingpoint, greyIcon);
					that.clickedmarker = a;


				});

			}
		}



		var featureGroup = L.featureGroup(array);
		this.markerClusterData = array;

		if (array.length == 0) {
			this.layers = [];

		}
		else {
			var fitbounds = featureGroup.getBounds();
			var corner1 = L.latLng(fitbounds['_northEast']['lat'], fitbounds['_northEast']['lng']), corner2 = L.latLng(fitbounds['_southWest']['lat'], fitbounds['_southWest']['lng']);
			this.fitBounds = L.latLngBounds(corner1, corner2);
		}

		this.options = {
			layers: [
				L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Futures-Services.GmbH' }), L.marker([this.sellingpoint_lat, this.sellingpoint_lng], { icon: redIcon, title: this.sellinpointname }).bindPopup(this.sellinpointname).openPopup()],
			renderer: L.canvas(),
			zoom: 9,
			center: L.latLng({ lat: this.sellingpoint_lat, lng: this.sellingpoint_lng })
		};

	}
	object_delete_data: object;

	////////////////////////////////////////////////////////////////////////////////////////// Adding Zones //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	addingzones(finaldeliveryzone: any, id) {
		var size = Object.keys(finaldeliveryzone).length;

		function getRandomColor(size) {
			var number = size % 4;
			var color;
			switch (number) {
				case 0:
					color = '#277fca';
					break;
				case 1:
					color = '#ca8428';
					break;
				case 2:
					color = '#25ac22';
					break;
				case 3:
					color = '#9a28ca';
					break;
				default:
					color = '#277fca';
			}

			return color;
		}


		if (finaldeliveryzone['zone' + size].zoneinfo.to && !this.lessvalue && size <= 9) {
			this.lessvalue = false;
			this.submitbutton = false;
			this.afterlieferclick = false;
			let object = { id: id, number: size + 1, color: getRandomColor(size), from: finaldeliveryzone['zone' + size].zoneinfo.to };

			this.VerkaufsburoSpcService.addingzones( object).subscribe( data=>{
				this.finaldeliveryzone = data.data[id]['temp'];
				//this.deliveryzonestocomp.emit(data.data);
			});
					

			

		}
		else if (size > 9) {
			this.submitbutton = false;
		}
		else {
			this.lessvalue = true;
			this.submitbutton = true;
		}

	}


	ngOnInit() {
		let presentid = this.deliveryzones.presentdeleveryzoneid;
		this.deliveryzones = this.VerkaufsburoSpcService.deliveryzones_local;
		this.finaldeliveryzone = this.deliveryzones[presentid]['real'];
		//console.log(this.verkaufsburos,presentid,this.deliveryzones)
		let data= this.verkaufsburos.find(x => x._id === presentid);
			this.sellinpointname = data.pc_name;
			this.sellingpoint_lat = data.sellingpoint_latitude;
			this.sellingpoint_lng = data.sellingpoint_longitude;
	
		this.sellingpoint_id = presentid;
		this.methodme(this.sellingpoint_id, this.username);



	}


	zonetovalue(value, sellingpoint_id, zone_name, from) {
		if (parseInt(value) > parseInt(from)) {
			this.submitbutton = true;
			this.lessvalue = false;
			let object = { id: sellingpoint_id, to: parseInt(value), zonename: zone_name };
			this.VerkaufsburoSpcService.deliveryzones_local
			this.VerkaufsburoSpcService.zonestovalues( object).subscribe(
				data => {
					this.finaldeliveryzone = data[sellingpoint_id]['temp'];
					

				}
				
			);
		}
		else {
			this.submitbutton = false;
			this.lessvalue = true;
		}

	}


	view(arg) {
		this.clickedview = arg;
		if (arg === "mapview") {

			this.methodme(this.sellingpoint_id, this.username);
		}
	}




	onMapReady(map: L.Map) {
		this.map = map;

	}

	numbers() {
		return new Array(Math.ceil((Object.keys(this.finaldeliveryzone).length) / 3)).map((val, idx) => idx);
	}


	columnize(data) {
		let m = Math.ceil(data.length / 3);
		let n = Math.ceil(2 * data.length / 3);

		let array = [data.slice(0, m), data.slice(m, n), data.slice(n, data.length)];
		return array;
	}



	disabledornot(key, id, bool, sellingpoint_id) {


		let object = { id: id, key: key, sellingpoint_id: sellingpoint_id };
		if (bool == false) {

			this.VerkaufsburoSpcService.disableremove( object).subscribe(
				data => {
					this.finaldeliveryzone = data.deliveryzones[sellingpoint_id]['temp'];

				}
			);
		} else {

			this.VerkaufsburoSpcService.disableadd(object).subscribe(
				data => {
					this.finaldeliveryzone = data.deliveryzones[sellingpoint_id]['temp'];

				}
			);

		}

	}




	plzcalculationforzones(finaldeliveryzone, id) {
		var size = Object.keys(finaldeliveryzone).length;
		var km = finaldeliveryzone['zone' + size].zoneinfo.to;
		var objectofobject = {};
		for (var k = 1; k <= size; k++) {
			objectofobject['zone' + k] = finaldeliveryzone['zone' + k].zoneinfo;
		}
		let object = { id: id, km: km, lat: this.sellingpoint_lat, lng: this.sellingpoint_lng, zones: objectofobject };
		this.busy = this.VerkaufsburoSpcService.plzcalculation( object).subscribe(
			data=>{
				this.finaldeliveryzone = data.data[id]['temp'];
				this.methodme(this.sellingpoint_id, this.username);
				this.submitbutton = true;
				this.afterlieferclick = true;
			}
		);
				

			
	}


	deletetempdata(sellingpoint) {
		let object = { id: sellingpoint };
		this.VerkaufsburoSpcService.deletetempdata( object).subscribe(
			data => {
				this.finaldeliveryzone = data.data[sellingpoint]['temp'];

				//this.deliveryzonestocomp.emit(data.data);
			}
		);
	


}


	submitlieferzonen(sellingpoint) {
		let object = { id: sellingpoint };
		this.VerkaufsburoSpcService.submitlieferzonen( object).subscribe(data => {
			this.finaldeliveryzone = data[sellingpoint]['temp'];
			//this.deliveryzonestocomp.emit(data);
		}
	);

	}


	deletezones(id, num) {
		let object = { id: id, num: num };

		this.VerkaufsburoSpcService.deletezones( object).subscribe(	data => {
			this.finaldeliveryzone = data.data[id]['temp'];
			//this.deliveryzonestocomp.emit(data.data);
			this.submitbutton = true;
			this.lessvalue = false;
		});	
	}


	tablezones(key) {
		this.zonekey = key;
	}
	tabs: any[] = [];
	zonekey: string = 'zone1';

	ceilevent(arg) {
		return Math.ceil(arg);

	}

}
