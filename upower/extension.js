const Lang = imports.lang;
const Mainloop = imports.mainloop;

const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const St = imports.gi.St;
const UPowerGlib = imports.gi.UPowerGlib;
const Pango = imports.gi.Pango;

const Main = imports.ui.main;
//const MessageTray = imports.ui.messageTray;
//const ModalDialog = imports.ui.modalDialog;
const PanelMenu = imports.ui.panelMenu;
//const PopupMenu = imports.ui.popupMenu;

//const Tweener = imports.ui.tweener;

const Gettext = imports.gettext.domain('gnome-shell-upower');
const Util = imports.misc.util;
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

const UPowerIFace = <interface name="org.freedesktop.UPower">
<method name="EnumerateDevices">
    <arg type="ao" direction="out"/>
</method>
<property name="OnBattery" type="b" access="read" />
</interface>

const UPowerDeviceIFace = <interface name="org.freedesktop.UPower.Device">
<property name="Technology" type="u" access="read" />
<property name="Capacity" type="d" access="read" />
<property name="IsRechargeable" type="b" access="read" />
<property name="State" type="u" access="read" />
<property name="IsPresent" type="b" access="read" />
<property name="Percentage" type="d" access="read" />
<property name="TimeToFull" type="x" access="read" />
<property name="TimeToEmpty" type="x" access="read" />
<property name="Online" type="b" access="read" />
<property name="PowerSupply" type="b" access="read" />
<property name="NativePath" type="s" access="read" />
<property name="Vendor" type="s" access="read" />
</interface>

const ProxyUPower = Gio.DBusProxy.makeProxyWrapper(UPowerIFace);
const ProxyUPowerDevice = Gio.DBusProxy.makeProxyWrapper(UPowerDeviceIFace);

const Indicator = new Lang.Class({
    Name: 'UPowerIndicator',
    Extends: PanelMenu.Button,

    _init: function() {
        this.parent(St.Align.START);

	this._proxy = new ProxyUPower(
	    Gio.DBus.system,
	    'org.freedesktop.UPower',
	    '/org/freedesktop/UPower');

	let [_names] = this._proxy.EnumerateDevicesSync();
	for (let i = 0; i < _names.length; i++) {
	    if (/battery_BAT1$/.test(_names[i])) {
		this._battery = new ProxyUPowerDevice(Gio.DBus.system,
						      'org.freedesktop.UPower',
						      _names[i]);
	    }
	}

        // Upower label
        this.label = new St.Label({ style_class: 'upower-label' });
        this.label.clutter_text.set_line_wrap(false);
        this.label.clutter_text.set_ellipsize(Pango.EllipsizeMode.NONE);
	this.label.set_text("...");
        this.actor.add_actor(this.label);

	// this.actor.connect("enter-event", Lang.bind(this, this._updateLabel));
	// this.actor.connect("leave-event", Lang.bind(this, this._updateLabel));

	this._updateLabel();
	this._sig_id = this._proxy.connect('g-signal', Lang.bind(this, this._proxySignaled));
	//log("Sig: "+ this._sig_id);
    },

    _proxySignaled: function (proxy, sender, signame, params, data) {
	//log("Signaled: "+ signame +" params: "+ params.deep_unpack());
	if (signame == "Changed") {
	    this._proxy.call('org.freedesktop.DBus.Properties.Get',
			   new GLib.Variant('(ss)',
					    [this._proxy.g_interface_name,
					    "OnBattery"]),
			   Gio.DBusCallFlags.NONE, -1, null,
			   Lang.bind(this, function(proxy, result) {
			       try {
				   this._proxy.set_cached_property(
				       'OnBattery',
				       this._battery.call_finish(
					   result).get_child_value(0).unpack());
			       } catch(e) {
				   log('Could not get or set_cached property: '+ e);
			       }
			   }));
	}
	if (signame == "DeviceChanged" && params.deep_unpack() == this._battery.g_object_path) {
	    this._refreshBatteryProps();
	}
    },
    _refreshBatteryProps: function () {
	this._battery.call('org.freedesktop.DBus.Properties.GetAll',
			   new GLib.Variant('(s)',
					    [this._battery.g_interface_name]),
			   Gio.DBusCallFlags.NONE, -1, null,
			   Lang.bind(this, function(proxy, result) {
			       try {
				   let props = this._battery.call_finish(
					   result).get_child_value(0).unpack();

				   // TODO refresh all props
				   this._battery.set_cached_property("Percentage", props.Percentage.unpack());
				   this._battery.set_cached_property("TimeToFull", props.TimeToFull.unpack());
				   this._battery.set_cached_property("TimeToEmpty", props.TimeToEmpty.unpack());
				   this._battery.set_cached_property("State", props.State.unpack());

				   this._updateLabel();
			       } catch(e) {
				   log('Could not getAll or set_cached property: '+ e);
			       }
			   }));
    },

    _updateLabel: function (){
	if (this._battery != undefined)
	    {
		let perc = this._battery.Percentage;
		let state = UPowerGlib.Device.state_to_string(this._battery.State);
		let time = null;
		if (this._proxy.OnBattery) {
		    time = this._battery.TimeToEmpty / 3600;
		} else {
		    time = this._battery.TimeToFull / 3600;
		}
		this.label.set_text(
		    "%.1f%% , %s left %.1f hours".format(
			perc, state, time
		    ));
	    } else { this.label.set_text("No battery"); }
    },

    destroy: function() {
        if (this._battery) {
	    this._battery.unref();
        }
	this._proxy.disconnect(this._sig_id);
	this._proxy.unref();
	this.parent();
    }
});

let indicator;

function init() {
}


function enable() {
    if (!indicator) {
        indicator = new Indicator();
        Main.panel.addToStatusArea('upower', indicator);
    }
}

function disable() {
    if (indicator) {
        indicator.destroy();
        indicator = null;
    }
}
